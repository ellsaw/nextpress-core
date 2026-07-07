/**
 * Retrieves the blog name.
 *
 * @returns {Promise<string>} The blog name, defaulting to 'My Blog' if not found.
 */
export async function getBlogname(): Promise<string> {
    const blognameOption = await getOption('blogname');
    return blognameOption ?? 'My Blog';
}
