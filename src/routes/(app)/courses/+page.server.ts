import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const user = locals.user!;

	let courses: any[] = [];
	try {
		const result = await pb.collection('courses').getList(1, 100, {
			filter: `creator = "${user.id}"`,
			sort: '-created'
		});
		courses = result.items;
	} catch {
		// Collection may not exist yet
	}

	return { courses };
};
