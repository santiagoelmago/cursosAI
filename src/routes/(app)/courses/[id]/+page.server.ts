import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	const user = locals.user!;

	let course: any;
	try {
		course = await pb.collection('courses').getOne(params.id);
	} catch {
		error(404, 'Course not found');
	}

	if (course.creator !== user.id) error(403, 'Not your course');

	return { course };
};

export const actions: Actions = {
	update: async ({ params, request, locals }) => {
		const pb = locals.pb;
		const data = await request.formData();

		const title = (data.get('title') as string)?.trim();
		const description = (data.get('description') as string)?.trim();
		const priceRaw = data.get('price') as string;
		const slug = (data.get('slug') as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

		if (!title) return fail(400, { error: 'Title is required' });

		const price_cents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : 0;

		try {
			await pb.collection('courses').update(params.id, { title, description, slug, price_cents });
		} catch (err: any) {
			return fail(400, { error: err?.response?.message || 'Update failed' });
		}

		return { success: true };
	},

	delete: async ({ params, locals }) => {
		const pb = locals.pb;
		await pb.collection('courses').delete(params.id);
		redirect(302, '/courses');
	}
};
