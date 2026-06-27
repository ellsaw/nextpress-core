/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - The string to process.
 * @returns {string} The string with its first letter capitalized.
 */
export function capitalizeFirstLetter(string: string): string {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}
