import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	const user = locals.user!;

	const course = await pb.collection('courses').getOne(params.id).catch(() => error(404, 'Course not found'));
	if (course.creator !== user.id) error(403, 'Not your course');

	const step = await pb.collection('steps').getOne(params.stepId).catch(() => error(404, 'Step not found'));

	return { course, step };
};

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		const pb = locals.pb;
		const data = await request.formData();

		const title = (data.get('title') as string)?.trim();
		const message_body = (data.get('message_body') as string)?.trim();
		const media_url = (data.get('media_url') as string)?.trim();
		const delay_hours = parseInt(data.get('delay_hours') as string) || 0;

		await pb.collection('steps').update(params.stepId, {
			title,
			message_body,
			media_url: media_url || null,
			delay_hours
		});

		redirect(302, `/courses/${params.id}/steps`);
	}
};
