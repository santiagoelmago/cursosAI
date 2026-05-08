import { json } from '@sveltejs/kit';
import { stripe } from '$lib/stripe';
import { getAdminPb } from '$lib/pocketbase-admin';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const sig = request.headers.get('stripe-signature');

	if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
		return json({ error: 'Missing signature' }, { status: 400 });
	}

	let event: any;
	try {
		event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
	} catch (err: any) {
		return json({ error: `Webhook error: ${err.message}` }, { status: 400 });
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		const enrollmentId = session.metadata?.enrollment_id;
		const courseId = session.metadata?.course_id;

		if (!enrollmentId || !courseId) {
			return json({ error: 'Missing metadata' }, { status: 400 });
		}

		const pb = await getAdminPb();
		const enrolledAt = new Date();

		// Activate enrollment
		try {
			await pb.collection('enrollments').update(enrollmentId, {
				status: 'active',
				enrolled_at: enrolledAt.toISOString(),
				stripe_session_id: session.id
			});
		} catch (err: any) {
			console.error('Failed to activate enrollment:', err);
			return json({ error: 'Failed to activate enrollment' }, { status: 500 });
		}

		// Schedule message_logs for every step
		let steps: any[] = [];
		try {
			const result = await pb.collection('steps').getList(1, 200, {
				filter: `course = "${courseId}"`,
				sort: 'order'
			});
			steps = result.items;
		} catch {}

		for (const step of steps) {
			const scheduledAt = new Date(enrolledAt.getTime() + step.delay_hours * 60 * 60 * 1000);
			try {
				await pb.collection('message_logs').create({
					enrollment: enrollmentId,
					step: step.id,
					status: 'pending',
					scheduled_at: scheduledAt.toISOString()
				});
			} catch (err) {
				console.error(`Failed to create message_log for step ${step.id}:`, err);
			}
		}
	}

	return json({ received: true });
};
