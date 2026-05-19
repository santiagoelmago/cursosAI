import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	if (!env.BAILEYS_WEBHOOK_SECRET || auth !== `Bearer ${env.BAILEYS_WEBHOOK_SECRET}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { userId, from, text, timestamp } = await request.json();
	const phone = from?.replace('@s.whatsapp.net', '');
	console.log(`[incoming] user=${userId} from=${phone}: ${text}`);

	return json({ ok: true });
};
