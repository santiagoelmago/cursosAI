import { error } from '@sveltejs/kit';
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

	let steps: any[] = [];
	try {
		const result = await pb.collection('steps').getList(1, 200, {
			filter: `course = "${params.id}"`,
			sort: 'order'
		});
		steps = result.items;
	} catch {
		// Steps collection may not exist yet
	}

	return { course, steps };
};

export const actions: Actions = {
	// Reorder: move a step up or down
	reorder: async ({ params, request, locals }) => {
		const pb = locals.pb;
		const data = await request.formData();
		const stepId = data.get('stepId') as string;
		const direction = data.get('direction') as 'up' | 'down';

		const result = await pb.collection('steps').getList(1, 200, {
			filter: `course = "${params.id}"`,
			sort: 'order'
		});
		const steps = result.items;
		const idx = steps.findIndex((s: any) => s.id === stepId);
		if (idx < 0) return;

		const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
		if (swapIdx < 0 || swapIdx >= steps.length) return;

		await Promise.all([
			pb.collection('steps').update(steps[idx].id, { order: steps[swapIdx].order }),
			pb.collection('steps').update(steps[swapIdx].id, { order: steps[idx].order })
		]);
	},

	delete: async ({ request, locals }) => {
		const pb = locals.pb;
		const data = await request.formData();
		const stepId = data.get('stepId') as string;
		await pb.collection('steps').delete(stepId);
	}
};
