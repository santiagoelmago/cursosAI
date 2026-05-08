import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { stripe } from '$lib/stripe';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	const user = locals.user!;

	const course = await pb.collection('courses').getOne(params.id).catch(() => error(404, 'Course not found'));
	if (course.creator !== user.id) error(403, 'Not your course');
	if (course.status === 'published') redirect(302, `/courses/${params.id}`);

	let stepCount = 0;
	try {
		const steps = await pb.collection('steps').getList(1, 1, { filter: `course = "${params.id}"` });
		stepCount = steps.totalItems;
	} catch {}

	return { course, stepCount };
};

export const actions: Actions = {
	default: async ({ params, locals }) => {
		const pb = locals.pb;
		const user = locals.user!;

		const course = await pb.collection('courses').getOne(params.id).catch(() => error(404, 'Not found'));
		if (course.creator !== user.id) return fail(403, { error: 'Not your course' });

		try {
			const product = await stripe.products.create({
				name: course.title,
				description: course.description || undefined
			});

			const price = await stripe.prices.create({
				product: product.id,
				unit_amount: course.price_cents || 0,
				currency: course.currency || 'usd'
			});

			await pb.collection('courses').update(params.id, {
				stripe_product_id: product.id,
				stripe_price_id: price.id,
				status: 'published'
			});
		} catch (err: any) {
			return fail(500, { error: err?.message || 'Failed to publish. Check your Stripe keys.' });
		}

		redirect(302, `/courses/${params.id}`);
	}
};
