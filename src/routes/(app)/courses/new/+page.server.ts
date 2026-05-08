import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const pb = locals.pb;
		const user = locals.user!;
		const data = await request.formData();

		const title = (data.get('title') as string)?.trim();
		const description = (data.get('description') as string)?.trim();
		const priceRaw = data.get('price') as string;
		const slug = (data.get('slug') as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

		if (!title) return fail(400, { error: 'Title is required' });
		if (!slug) return fail(400, { error: 'Slug is required' });

		const price_cents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : 0;

		let course: any;
		try {
			course = await pb.collection('courses').create({
				title,
				description,
				slug,
				price_cents,
				currency: 'usd',
				status: 'draft',
				creator: user.id
			});
		} catch (err: any) {
			const msg = err?.response?.data?.slug?.message
				? 'That slug is already taken'
				: err?.response?.message || 'Failed to create course';
			return fail(400, { error: msg });
		}

		redirect(302, `/courses/${course.id}/steps`);
	}
};
