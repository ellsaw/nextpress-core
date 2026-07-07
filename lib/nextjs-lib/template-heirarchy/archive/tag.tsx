import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

/**
 * Loads the metadata for the Tag template.
 * Fallback: Archive
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function TagMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Tag');
    return {...(await ArchiveMetadata()), ...metadata};
}

/**
 * Renders the Tag template. Falls back to the Archive template if not found.
 * Fallback: Archive
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function TagTemplate(): Promise<JSX.Element> {
    const Category = await loadTemplate('Tag');
    if (!Category) return <ArchiveTemplate/>

    return <Category/>;
}


