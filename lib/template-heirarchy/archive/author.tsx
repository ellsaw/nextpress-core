import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

/**
 * Loads the metadata for the Author template.
 * Fallback: Archive
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function AuthorMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Author');
    return {...(await ArchiveMetadata()), ...metadata};
}

/**
 * Renders the Author template. Falls back to the Archive template if not found.
 * Fallback: Archive
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function AuthorTemplate(): Promise<JSX.Element> {
    const Author = await loadTemplate('Author');
    if (!Author) return <ArchiveTemplate/>

    return <Author/>;
}
