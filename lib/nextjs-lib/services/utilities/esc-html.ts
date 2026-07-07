import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes an HTML string.
 *
 * @param {string} string - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export function escHtml(string: string) {
    return DOMPurify.sanitize(string);
}

