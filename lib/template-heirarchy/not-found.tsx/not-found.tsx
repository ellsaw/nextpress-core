import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

/**
 * Loads the metadata for the NotFound template.
 * Fallback: Index
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function NotFoundMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('NotFound');
    return {...(await IndexMetadata()), ...metadata};
}

/**
 * Renders the NotFound template. Falls back to the Index template if not found.
 * Fallback: Index
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function NotFoundTemplate(): Promise<JSX.Element> {
    const NotFound = await loadTemplate('NotFound');
    if (!NotFound) return <IndexTemplate/>

    return <NotFound/>;
}
