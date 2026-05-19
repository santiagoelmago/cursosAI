import express from 'express';
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadMediaMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import QRCode from 'qrcode';
import { rmSync } from 'fs';
import pino from 'pino';

const app = express();
app.use(express.json());

const SVELTEKIT_URL = process.env.SVELTEKIT_URL || 'http://localhost:5173';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

// userId -> { sock, status, qr }
const sessions = new Map();

const logger = pino({ level: 'silent' });

// Fetch once at startup so individual sessions don't each pay the network cost
let waVersion = null;
async function getWAVersion() {
  if (!waVersion) {
    const { version } = await fetchLatestBaileysVersion();
    waVersion = version;
    console.log(`WhatsApp version: ${version.join('.')}`);
  }
  return waVersion;
}

async function forwardIncoming(userId, from, text, timestamp, mediaBase64, mediaType) {
  try {
    await fetch(`${SVELTEKIT_URL}/api/whatsapp/incoming`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`
      },
      body: JSON.stringify({ userId, from, text, timestamp, mediaBase64: mediaBase64 || null, mediaType: mediaType || null })
    });
  } catch (err) {
    console.error(`[${userId}] Failed to forward incoming message:`, err.message);
  }
}

async function createSession(userId) {
  const existing = sessions.get(userId);
  if (existing?.status === 'connected') return;

  if (existing?.sock) {
    try { existing.sock.end(); } catch {}
  }

  const authFolder = `./sessions/${userId}`;
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const version = await getWAVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: false,
    browser: ['CursosAI', 'Chrome', '1.0.0'],
  });

  sessions.set(userId, { sock, status: 'connecting', qr: null });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    const session = sessions.get(userId);
    if (!session) return;

    if (qr) {
      const qrBase64 = await QRCode.toDataURL(qr);
      sessions.set(userId, { ...session, qr: qrBase64, status: 'connecting' });
    }

    if (connection === 'open') {
      sessions.set(userId, { ...session, qr: null, status: 'connected' });
      console.log(`[${userId}] Connected`);
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`[${userId}] Disconnected (reason: ${reason})`);

      const unrecoverable = [
        DisconnectReason.loggedOut,   // 401 — user logged out
        405,                           // policy violation / version rejected
        403,                           // banned
      ];

      if (unrecoverable.includes(reason)) {
        try { rmSync(authFolder, { recursive: true, force: true }); } catch {}
        sessions.delete(userId);
        console.log(`[${userId}] Session cleared (unrecoverable: ${reason})`);
      } else {
        sessions.set(userId, { ...session, status: 'connecting', qr: null });
        createSession(userId);
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;

      const from = msg.key.remoteJid;
      if (!from || from.endsWith('@g.us')) continue;

      const text =
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        '';

      const isImage = !!msg.message?.imageMessage;

      let mediaBase64 = null;
      let mediaType = null;
      if (isImage) {
        try {
          const buffer = await downloadMediaMessage(msg, 'buffer', {}, { logger, reuploadRequest: sock.updateMediaMessage });
          mediaBase64 = buffer.toString('base64');
          mediaType = 'image/jpeg';
        } catch (err) {
          console.error(`[${userId}] Failed to download image:`, err.message);
        }
      }

      if (!text && !mediaBase64) continue;

      // msg.messageTimestamp can be a proto Long — coerce to a plain number
      const ts = typeof msg.messageTimestamp === 'object'
        ? (msg.messageTimestamp?.toNumber?.() ?? Date.now() / 1000)
        : (msg.messageTimestamp || Date.now() / 1000);

      console.log(`[${userId}] Incoming from ${from}: ${text || '(image)'}`);
      await forwardIncoming(userId, from, text, ts, mediaBase64, mediaType);
    }
  });
}

app.post('/sessions/:userId/connect', async (req, res) => {
  const { userId } = req.params;
  await createSession(userId);
  const session = sessions.get(userId);
  res.json({ status: session?.status || 'connecting', qr: session?.qr || null });
});

app.get('/sessions/:userId/status', (req, res) => {
  const { userId } = req.params;
  const session = sessions.get(userId);
  if (!session) return res.json({ status: 'disconnected', qr: null });
  res.json({ status: session.status, qr: session.qr });
});

app.post('/sessions/:userId/send', async (req, res) => {
  const { userId } = req.params;
  const { to, message, mediaUrl } = req.body;

  const session = sessions.get(userId);
  if (!session || session.status !== 'connected') {
    return res.status(400).json({ error: 'Session not connected' });
  }

  const digits = to.replace(/\D/g, '');

  // Resolve correct JID — Mexican numbers may be registered as 521XXXXXXXXXX or 52XXXXXXXXXX
  let jid = digits + '@s.whatsapp.net';
  try {
    const [result] = await session.sock.onWhatsApp(digits + '@s.whatsapp.net');
    if (result?.exists) {
      jid = result.jid;
    } else {
      // Try alternate format (toggle the extra 1 after country code 52)
      let alt = digits;
      if (digits.startsWith('521') && digits.length === 13) alt = '52' + digits.slice(3);
      else if (digits.startsWith('52') && digits.length === 12) alt = '521' + digits.slice(2);

      if (alt !== digits) {
        const [altResult] = await session.sock.onWhatsApp(alt + '@s.whatsapp.net');
        if (altResult?.exists) {
          jid = altResult.jid;
          console.log(`[${userId}] Using alternate JID: ${jid}`);
        }
      }
    }
  } catch (e) {
    console.warn(`[${userId}] onWhatsApp lookup failed, using fallback JID:`, e.message);
  }

  try {
    let sent;
    if (mediaUrl) {
      sent = await session.sock.sendMessage(jid, { image: { url: mediaUrl }, caption: message });
    } else {
      sent = await session.sock.sendMessage(jid, { text: message });
    }
    console.log(`[${userId}] Sent to ${jid}: ${sent.key.id}`);
    res.json({ success: true, messageId: sent.key.id });
  } catch (err) {
    console.error(`[${userId}] Send failed to ${jid}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/sessions/:userId', (req, res) => {
  const { userId } = req.params;
  const session = sessions.get(userId);
  if (session?.sock) {
    try { session.sock.logout(); } catch {}
  }
  sessions.delete(userId);
  try { rmSync(`./sessions/${userId}`, { recursive: true, force: true }); } catch {}
  res.json({ success: true });
});

// On startup: pre-fetch WA version and restore any existing sessions from disk
async function init() {
  await getWAVersion();
  try {
    const { readdirSync, statSync } = await import('fs');
    const entries = readdirSync('./sessions');
    for (const entry of entries) {
      if (statSync(`./sessions/${entry}`).isDirectory()) {
        console.log(`Restoring session for ${entry}`);
        createSession(entry).catch(console.error);
      }
    }
  } catch {}
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Baileys service running on port ${PORT}`);
  init().catch(console.error);
});
