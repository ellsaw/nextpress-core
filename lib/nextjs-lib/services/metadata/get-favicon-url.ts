/**
 * Retrieves the URL of the site favicon.
 *
 * @returns {Promise<string|undefined>} The URL of the favicon, or undefined if not set.
 */
export async function getFaviconURL(): Promise<string|undefined> {
    const iconID = await getOption('site_icon');
    if (!iconID) return;

    const iconMediaPost = await getPost(Number(iconID));

    return iconMediaPost?.guid;
}
