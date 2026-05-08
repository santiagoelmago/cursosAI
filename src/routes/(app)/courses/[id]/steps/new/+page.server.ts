import { error, redirect } from '@sveltejs/kit';
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

	// Determine the next order value
	let nextOrder = 0;
	try {
		const result = await pb.collection('steps').getList(1, 1, {
			filter: `course = "${params.id}"`,
			sort: '-order'
		});
		if (result.items.length > 0) {
			nextOrder = result.items[0].order + 1;
		}
	} catch {
		// Steps collection may not exist yet
	}

	return { course, nextOrder };
};

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		const pb = locals.pb;
		const data = await request.formData();

		const title = (data.get('title') as string)?.trim();
		const message_body = (data.get('message_body') as string)?.trim();
		const media_url = (data.get('media_url') as string)?.trim();
		const delay_hours = parseInt(data.get('delay_hours') as string) || 0;
		const order = parseInt(data.get('order') as string) || 0;

		await pb.collection('steps').create({
			course: params.id,
			title,
			message_body,
			media_url: media_url || null,
			delay_hours,
			order
		});

		redirect(302, `/courses/${params.id}/steps`);
	}
};
