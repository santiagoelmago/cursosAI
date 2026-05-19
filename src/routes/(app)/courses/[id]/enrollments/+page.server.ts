import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pb = locals.pb;
	const user = locals.user!;

	const course = await pb.collection('courses').getOne(params.id).catch(() => error(404, 'Course not found'));
	if (course.creator !== user.id) error(403, 'Not your course');

	let enrollments: any[] = [];
	try {
		const result = await pb.collection('enrollments').getList(1, 200, {
			filter: `course = "${params.id}" && status != "pending"`,
			sort: '-enrolled_at'
		});
		enrollments = result.items;
	} catch {}

	const enrollmentIds = enrollments.map((e: any) => e.id);

	// Fetch full message logs (with step expand for message content)
	const logsMap: Record<string, any[]> = {};
	if (enrollmentIds.length > 0) {
		try {
			for (const id of enrollmentIds) {
				const logs = await pb.collection('message_logs').getList(1, 200, {
					filter: `enrollment = "${id}"`,
					expand: 'step',
					sort: 'scheduled_at'
				});
				logsMap[id] = logs.items;
			}
		} catch {}
	}

	// Fetch replies
	const responsesMap: Record<string, any[]> = {};
	if (enrollmentIds.length > 0) {
		try {
			const result = await pb.collection('whatsapp_responses').getList(1, 500, {
				filter: enrollmentIds.map((id) => `enrollment = "${id}"`).join(' || '),
				sort: '-received_at'
			});
			for (const r of result.items) {
				if (!responsesMap[r.enrollment]) responsesMap[r.enrollment] = [];
				responsesMap[r.enrollment].push(r);
			}
		} catch {}
	}

	return { course, enrollments, logsMap, responsesMap };
};
