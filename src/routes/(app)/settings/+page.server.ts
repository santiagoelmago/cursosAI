import { getAdminPb } from '$lib/pocketbase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const pb = await getAdminPb();

	let session = null;
	try {
		const results = await pb.collection('whatsapp_sessions').getList(1, 1, {
			filter: `user = "${locals.user?.id}"`
		});
		session = results.items[0] ?? null;
	} catch {}

	return { session };
};
