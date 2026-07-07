import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

/**
 * Loads the metadata for the Archive template.
 * Fallback: Index
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function ArchiveMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Archive');
    return {...(await IndexMetadata()), ...metadata};
}

/**
 * Renders the Archive template. Falls back to the Index template if not found.
 * Fallback: Index
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function ArchiveTemplate(): Promise<JSX.Element> {
    const Archive = await loadTemplate('Archive');
    if (!Archive) return <IndexTemplate/>

    return <Archive/>;
}
