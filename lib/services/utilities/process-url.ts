/**
 * Processes a URL by stripping the site URL prefix if it is present.
 *
 * @param {string} url - The URL to process.
 * @returns {string} The processed URL.
 */
export function processURL(url: string): string {
    if (!process.env.WP_SITE_URL) return url;

    if (url.startsWith(process.env.WP_SITE_URL)) {
        url = url.slice(process.env.WP_SITE_URL.length);
    }

    return url || '/';
}
