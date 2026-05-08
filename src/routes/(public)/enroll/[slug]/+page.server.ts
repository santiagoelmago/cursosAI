import { error, fail, redirect } from '@sveltejs/kit';
import { stripe } from '$lib/stripe';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;

	let courses: any[];
	try {
		const result = await pb.collection('courses').getList(1, 1, {
			filter: `slug = "${params.slug}" && status = "published"`
		});
		courses = result.items;
	} catch {
		error(404, 'Course not found');
	}

	if (!courses.length) error(404, 'Course not found or not published');

	return { course: courses[0] };
};

export const actions: Actions = {
	default: async ({ params, request, locals, url }) => {
		const pb = locals.pb;
		const data = await request.formData();

		const student_name = (data.get('student_name') as string)?.trim();
		const student_email = (data.get('student_email') as string)?.trim();
		let whatsapp_number = (data.get('whatsapp_number') as string)?.trim();

		if (!student_name || !student_email || !whatsapp_number) {
			return fail(400, { error: 'All fields are required' });
		}

		// Normalize WhatsApp number to E.164
		whatsapp_number = whatsapp_number.replace(/\s+/g, '');
		if (!whatsapp_number.startsWith('+')) whatsapp_number = '+' + whatsapp_number;

		// Get course
		const result = await pb.collection('courses').getList(1, 1, {
			filter: `slug = "${params.slug}" && status = "published"`
		});
		if (!result.items.length) return fail(404, { error: 'Course not found' });
		const course = result.items[0];

		// Create pending enrollment
		let enrollment: any;
		try {
			enrollment = await pb.collection('enrollments').create({
				course: course.id,
				student_name,
				student_email,
				whatsapp_number,
				status: 'pending'
			});
		} catch (err: any) {
			return fail(500, { error: 'Failed to create enrollment. Please try again.' });
		}

		// If free course, activate immediately
		if (!course.price_cents) {
			await pb.collection('enrollments').update(enrollment.id, {
				status: 'active',
				enrolled_at: new Date().toISOString()
			});
			// Schedule messages
			await scheduleMessages(pb, enrollment.id, course.id, new Date());
			redirect(302, `/enroll/${params.slug}/success?enrollment=${enrollment.id}`);
		}

		// Paid course — create Stripe checkout session
		const appUrl = env.PUBLIC_APP_URL || url.origin;
		let session: any;
		try {
			session = await stripe.checkout.sessions.create({
				mode: 'payment',
				line_items: [{ price: course.stripe_price_id, quantity: 1 }],
				success_url: `${appUrl}/enroll/${params.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${appUrl}/enroll/${params.slug}`,
				customer_email: student_email,
				metadata: { enrollment_id: enrollment.id, course_id: course.id }
			});
		} catch (err: any) {
			return fail(500, { error: 'Failed to create payment session. Please try again.' });
		}

		redirect(302, session.url);
	}
};

async function scheduleMessages(pb: any, enrollmentId: string, courseId: string, enrolledAt: Date) {
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
		await pb.collection('message_logs').create({
			enrollment: enrollmentId,
			step: step.id,
			status: 'pending',
			scheduled_at: scheduledAt.toISOString()
		});
	}
}
