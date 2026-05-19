import { json } from '@sveltejs/kit';
import { getAdminPb } from '$lib/pocketbase-admin';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const BAILEYS_URL = env.BAILEYS_SERVICE_URL || 'http://localhost:3001';

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const pb = await getAdminPb();
	const now = new Date().toISOString();

	let pendingLogs: any[] = [];
	try {
		const result = await pb.collection('message_logs').getList(1, 20, {
			filter: `status = "pending" && scheduled_at <= "${now}"`,
			expand: 'enrollment,step,enrollment.course'
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
		const course = log.expand?.enrollment?.expand?.course;

		if (!enrollment || !step || !course?.creator) continue;

		const userId = course.creator;

		const firstName = enrollment.student_name?.split(' ')[0] || enrollment.student_name || '';
		const message = step.message_body
			.replace(/\{name\}/gi, firstName)
			.replace(/\{full_name\}/gi, enrollment.student_name || '')
			.replace(/\{email\}/gi, enrollment.student_email || '')
			.replace(/\{course_name\}/gi, course.title || '');

		try {
			const res = await fetch(`${BAILEYS_URL}/sessions/${userId}/send`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					to: enrollment.whatsapp_number,
					message,
					mediaUrl: step.media_url || null
				})
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || `Baileys error ${res.status}`);
			}

			const result = await res.json();

			await pb.collection('message_logs').update(log.id, {
				status: 'sent',
				sent_at: new Date().toISOString(),
				twilio_sid: result.messageId  // reusing field name for the message ID
			});
			sent++;
		} catch (err: any) {
			console.error(`Failed to send message log ${log.id}:`, err.message);
			await pb.collection('message_logs').update(log.id, {
				status: 'failed',
				error_message: err?.message || 'Unknown error'
			});
			failed++;
		}
	}

	return json({ processed: pendingLogs.length, sent, failed });
};
