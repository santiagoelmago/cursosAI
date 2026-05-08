import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

let _adminPb: PocketBase | null = null;
let _authExpiry = 0;

export async function getAdminPb(): Promise<PocketBase> {
	const now = Date.now();
	if (_adminPb && _adminPb.authStore.isValid && now < _authExpiry) {
		return _adminPb;
	}

	_adminPb = new PocketBase(env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

	if (!env.POCKETBASE_ADMIN_EMAIL || !env.POCKETBASE_ADMIN_PASSWORD) {
		throw new Error('POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD must be set');
	}

	// PocketBase 0.22+ uses _superusers collection for admin auth
	try {
		await _adminPb.collection('_superusers').authWithPassword(
			env.POCKETBASE_ADMIN_EMAIL,
			env.POCKETBASE_ADMIN_PASSWORD
		);
	} catch {
		// Fallback for older PocketBase server versions
		await (_adminPb as any).admins.authWithPassword(
			env.POCKETBASE_ADMIN_EMAIL,
			env.POCKETBASE_ADMIN_PASSWORD
		);
	}

	// Cache for 50 minutes (tokens expire at 1h by default)
	_authExpiry = now + 50 * 60 * 1000;
	return _adminPb;
}
