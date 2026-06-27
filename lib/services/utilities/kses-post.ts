import parse from 'html-react-parser';
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes and parses an HTML string into React elements.
 *
 * @param {string} html - The HTML string to process.
 * @returns {string | JSX.Element | JSX.Element[]} The parsed React elements.
 */
export function wpKsesPost(html: string) {
    const cleanHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    return parse(cleanHtml);
}
