import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

/**
 * Loads the metadata for the Category template.
 * Fallback: Archive
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function CategoryMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Category');
    return {...(await ArchiveMetadata()), ...metadata};
}

/**
 * Renders the Category template. Falls back to the Archive template if not found.
 * Fallback: Archive
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function CategoryTemplate(): Promise<JSX.Element> {
    const Category = await loadTemplate('Category');
    if (!Category) return <ArchiveTemplate/>

    return <Category/>;
}

