import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from "next/server";

/**
 * Processes GET requests to validate WordPress session and enable draft mode.
 *
 * @param {NextRequest} request - Incoming request.
 * @returns {Promise<never>} Redirects to target URL.
 */
export async function apiGetDraftMode(request: NextRequest): Promise<never> {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirect') || '/';

    const draft = await draftMode();

    const cookies = request.cookies.getAll();
    const wpCookie = cookies.find(cookie => cookie.name.startsWith('wordpress_logged_in_'));

    let userId = 0;

    if (!wpCookie?.value) {
        console.warn('Wordpress login cookie missing.');
        draft.disable();
        redirect(redirectUrl + `?nextpress_logged_in_user_id=${userId}`);
    }

    try {
        const validLogin = await fetch(`${process.env.WP_SERVICE_URL}/wp-json/nextpress/v1/validate-user-session/?user_hash=${wpCookie.value}`, {
            headers: {
                'Authorization': `api-key ${process.env.CROSS_CONTAINER_API_KEY}`
            }
        });

        if (!validLogin.ok) throw new Error(`Validation failed with status code: ${validLogin.status}`);

        const response = await validLogin.json();
        userId = Number(response.user_id) || 0;

        draft.enable();
    } catch (error: any) {
        console.warn('Could not validate Wordpress login:', error.message);
        draft.disable();
    }

    redirect(redirectUrl + `?nextpress_logged_in_user_id=${userId}`);
}
