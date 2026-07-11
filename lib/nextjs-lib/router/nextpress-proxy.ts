import { NextRequest, NextResponse } from "next/server";

/**
 * Processes incoming requests to manage WordPress session cookies and redirects.
 *
 * @param {NextRequest} request - Incoming request.
 * @returns {NextResponse} Response to proceed or redirect.
 */
export function nextpressProxy(request: NextRequest): NextResponse {
    const url = request.nextUrl;

    if (url.pathname.startsWith('/api/draft')) {
        return NextResponse.next();
    }

    if (url.searchParams.has('nextpress_logged_in_user_id')) {
        const loggedInUserId = url.searchParams.get('nextpress_logged_in_user_id');
        url.searchParams.delete('nextpress_logged_in_user_id');

        const response = NextResponse.redirect(url);
        response.cookies.set('nextpress_logged_in_user_id', loggedInUserId || '0');
        return response;
    }

    const cookies = request.cookies;

    const hasWordpressCookie = cookies.getAll().some(cookie =>
        cookie.name.startsWith('wordpress_logged_in_')
    );

    if (request.cookies.has('nextpress_logged_in_user_id') && hasWordpressCookie) {
        return NextResponse.next();
    }

    if (hasWordpressCookie) {
        const currentPath = url.pathname + url.search;

        const redirectUrl = url.clone();
        redirectUrl.pathname = '/api/draft';
        redirectUrl.searchParams.set('redirect', currentPath);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}
