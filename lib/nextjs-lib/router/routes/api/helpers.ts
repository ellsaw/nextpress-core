import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

/**
 * Checks if request is authorized using API key.
 *
 * @param {ReadonlyHeaders} headerList - Headers from request.
 * @returns {boolean} True if authorized, false otherwise.
 */
export function isAuthorized(headerList: ReadonlyHeaders): boolean {
    const authHeader = headerList.get('Authorization');
    if (authHeader && authHeader.startsWith('api-key ')) {
        const apiKey = authHeader.split(' ')[1];
        return apiKey === process.env.CROSS_CONTAINER_API_KEY;
    } else {
        return false;
    }
}
