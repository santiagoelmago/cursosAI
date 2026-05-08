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

	// For each enrollment, get message progress
	const enrollmentIds = enrollments.map((e: any) => e.id);
	const progressMap: Record<string, { total: number; sent: number; failed: number }> = {};

	if (enrollmentIds.length > 0) {
		try {
			for (const id of enrollmentIds) {
				const logs = await pb.collection('message_logs').getList(1, 200, {
					filter: `enrollment = "${id}"`
				});
				const total = logs.totalItems;
				const sent = logs.items.filter((l: any) => l.status === 'sent').length;
				const failed = logs.items.filter((l: any) => l.status === 'failed').length;
				progressMap[id] = { total, sent, failed };
			}
		} catch {}
	}

	return { course, enrollments, progressMap };
};
