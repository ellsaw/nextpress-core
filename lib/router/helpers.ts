/**
 * Retrieves page number from path array.
 *
 * @param {string[]} path - Array of path segments.
 * @returns {number | undefined} Page number or undefined.
 */
export function getPageNumber(path: string[]): number|undefined {
    return path[path.length - 2] === 'page' ? Number(path[path.length - 1]) || undefined : undefined;
}

/**
 * Splits path string into array of segments.
 *
 * @param {string} path - Path string.
 * @returns {string[]} Array of path segments.
 */
export function splitPath(path: string): string[] {
    if (!path) return [];
    return path.split('/').filter(Boolean);
}
