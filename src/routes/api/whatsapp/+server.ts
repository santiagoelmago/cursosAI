import { json } from '@sveltejs/kit';
import { getAdminPb } from '$lib/pocketbase-admin';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const BAILEYS_URL = env.BAILEYS_SERVICE_URL || 'http://localhost:3001';

// POST /api/whatsapp — connect (generate QR)
export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	const res = await fetch(`${BAILEYS_URL}/sessions/${userId}/connect`, { method: 'POST' });
	const data = await res.json();

	// Upsert session record in PocketBase
	const pb = await getAdminPb();
	const existing = await pb.collection('whatsapp_sessions').getList(1, 1, {
		filter: `user = "${userId}"`
	}).catch(() => ({ items: [] }));

	if (existing.items[0]) {
		await pb.collection('whatsapp_sessions').update(existing.items[0].id, { status: 'connecting' });
	} else {
		await pb.collection('whatsapp_sessions').create({ user: userId, status: 'connecting' });
	}

	return json(data);
};

// GET /api/whatsapp — poll status + QR
export const GET: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	const res = await fetch(`${BAILEYS_URL}/sessions/${userId}/status`);
	const data = await res.json();

	// Sync status to PocketBase when connected
	if (data.status === 'connected') {
		const pb = await getAdminPb();
		const existing = await pb.collection('whatsapp_sessions').getList(1, 1, {
			filter: `user = "${userId}"`
		}).catch(() => ({ items: [] }));

		if (existing.items[0] && existing.items[0].status !== 'connected') {
			await pb.collection('whatsapp_sessions').update(existing.items[0].id, {
				status: 'connected',
				connected_at: new Date().toISOString()
			});
		}
	}

	return json(data);
};

// DELETE /api/whatsapp — disconnect
export const DELETE: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;
	if (!userId) return json({ error: 'Unauthorized' }, { status: 401 });

	await fetch(`${BAILEYS_URL}/sessions/${userId}`, { method: 'DELETE' });

	const pb = await getAdminPb();
	const existing = await pb.collection('whatsapp_sessions').getList(1, 1, {
		filter: `user = "${userId}"`
	}).catch(() => ({ items: [] }));

	if (existing.items[0]) {
		await pb.collection('whatsapp_sessions').update(existing.items[0].id, { status: 'disconnected' });
	}

	return json({ success: true });
};
