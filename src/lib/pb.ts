import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/public';

// Provide a default fallback to localhost if the environment variable is not set yet
export const pb = new PocketBase(env.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Helper to determine if we are running in the browser
export const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    pb.authStore.loadFromCookie(document.cookie);
    
    // Optional: Sync real-time updates to cookies
    pb.authStore.onChange(() => {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
    });
}
