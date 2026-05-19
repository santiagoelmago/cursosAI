import { error, fail, redirect } from '@sveltejs/kit';
import { getAdminPb } from '$lib/pocketbase-admin';
import type { Actions, PageServerLoad } from './$types';

const COOKIE = (slug: string) => `community_${slug}`;

export const load: PageServerLoad = async ({ params, cookies }) => {
	const pb = await getAdminPb();

	let course: any;
	try {
		const result = await pb.collection('courses').getList(1, 1, {
			filter: `slug = "${params.slug}"`
		});
		if (!result.items.length) error(404, 'Course not found');
		course = result.items[0];
	} catch (e: any) {
		if (e?.status === 404) throw e;
		error(404, 'Course not found');
	}

	if (!course.community_enabled) error(404, 'Community not enabled for this course');

	// Check if already verified
	const enrollmentId = cookies.get(COOKIE(params.slug));
	if (enrollmentId) {
		try {
			const enrollment = await pb.collection('enrollments').getOne(enrollmentId);
			if (enrollment.course === course.id) {
				return await loadFeed(pb, course, enrollment);
			}
		} catch {}
		// Cookie is stale — clear it and show the gate
		cookies.delete(COOKIE(params.slug), { path: '/' });
	}

	return {
		gated: true as const,
		course: { title: course.title, slug: course.slug }
	};
};

export const actions: Actions = {
	verify: async ({ params, request, cookies }) => {
		const pb = await getAdminPb();
		const data = await request.formData();

		let number = (data.get('whatsapp_number') as string)?.trim();
		if (!number) return fail(400, { error: 'Enter your WhatsApp number' });

		number = number.replace(/\s+/g, '');
		if (!number.startsWith('+')) number = '+' + number;

		// Find the course
		const courseResult = await pb.collection('courses').getList(1, 1, {
			filter: `slug = "${params.slug}"`
		});
		if (!courseResult.items.length) return fail(404, { error: 'Course not found' });
		const course = courseResult.items[0];

		// Try both Mexican number formats
		const candidates = [number];
		const digits = number.replace(/\D/g, '');
		if (digits.startsWith('521') && digits.length === 13) candidates.push('+52' + digits.slice(3));
		else if (digits.startsWith('52') && digits.length === 12) candidates.push('+521' + digits.slice(2));

		let enrollment: any = null;
		for (const num of candidates) {
			try {
				const result = await pb.collection('enrollments').getList(1, 1, {
					filter: `course = "${course.id}" && whatsapp_number = "${num}" && status != "pending"`
				});
				if (result.items.length) { enrollment = result.items[0]; break; }
			} catch {}
		}

		if (!enrollment) {
			return fail(400, { error: 'No active enrollment found for that number in this course.' });
		}

		cookies.set(COOKIE(params.slug), enrollment.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(302, `/community/${params.slug}`);
	}
};

async function loadFeed(pb: any, course: any, enrollment: any) {
	let posts: any[] = [];
	try {
		const result = await pb.collection('whatsapp_responses').getList(1, 500, {
			filter: `course = "${course.id}"`,
			expand: 'enrollment,step',
			sort: '-received_at'
		});
		posts = result.items.map((p: any) => ({
			id: p.id,
			message: p.message,
			received_at: p.received_at,
			student_name: p.expand?.enrollment?.student_name || 'Student',
			step_title: p.expand?.step?.title || null,
			media: p.media ? pb.files.getURL(p, p.media) : null
		}));
	} catch {}

	return {
		gated: false as const,
		course: { id: course.id, title: course.title, slug: course.slug },
		student_name: enrollment.student_name,
		posts
	};
}
