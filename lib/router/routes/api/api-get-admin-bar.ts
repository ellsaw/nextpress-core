import { NextRequest, NextResponse } from "next/server";

/**
 * Processes GET requests to fetch WordPress admin bar data.
 *
 * @param {NextRequest} request - Incoming request.
 * @returns {Promise<NextResponse>} Response containing admin bar data or error.
 */
export async function apiGetAdminBar(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const path = searchParams.get('path');

    try {
        const response = await fetch(`${process.env.WP_SERVICE_URL}/wp-json/nextpress/v1/get-admin-bar?user_id=${userId}&path=${path}`, {
            headers: {
                'Authorization': `api-key ${process.env.CROSS_CONTAINER_API_KEY}`
            }
        });

        if (!response.ok) return NextResponse.json({ error: 'Failed to fetch from WP' }, { status: response.status });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
