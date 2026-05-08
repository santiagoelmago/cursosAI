import { json } from '@sveltejs/kit';
import { getAdminPb } from '$lib/pocketbase-admin';
import { twilioClient } from '$lib/twilio';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	// Verify cron secret
	const auth = request.headers.get('authorization');
	const secret = env.CRON_SECRET;
	if (!secret || auth !== `Bearer ${secret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const pb = await getAdminPb();
	const now = new Date().toISOString();

	// Fetch pending messages that are due
	let pendingLogs: any[] = [];
	try {
		const result = await pb.collection('message_logs').getList(1, 20, {
			filter: `status = "pending" && scheduled_at <= "${now}"`,
			expand: 'enrollment,step'
		});
		pendingLogs = result.items;
	} catch (err) {
		console.error('Failed to fetch pending logs:', err);
		return json({ error: 'Failed to fetch pending logs' }, { status: 500 });
	}

	let sent = 0;
	let failed = 0;

	for (const log of pendingLogs) {
		const enrollment = log.expand?.enrollment;
		const step = log.expand?.step;

		if (!enrollment || !step) continue;

		const from = `whatsapp:${env.TWILIO_WHATSAPP_FROM || '+14155238886'}`;
		const to = `whatsapp:${enrollment.whatsapp_number}`;

		try {
			const messageOptions: any = {
				from,
				to,
				body: step.message_body
			};
			if (step.media_url) {
				messageOptions.mediaUrl = [step.media_url];
			}

			const message = await twilioClient.messages.create(messageOptions);

			await pb.collection('message_logs').update(log.id, {
				status: 'sent',
				sent_at: new Date().toISOString(),
				twilio_sid: message.sid
			});
			sent++;
		} catch (err: any) {
			console.error(`Failed to send message log ${log.id}:`, err);
			await pb.collection('message_logs').update(log.id, {
				status: 'failed',
				error_message: err?.message || 'Unknown Twilio error'
			});
			failed++;
		}
	}

	return json({ processed: pendingLogs.length, sent, failed });
};
