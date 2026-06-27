import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

/**
 * Loads the metadata for the Taxonomy template.
 * Fallback: Archive
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function TaxonomyMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Taxonomy');
    return {...(await ArchiveMetadata()), ...metadata};
}

/**
 * Renders the Taxonomy template. Falls back to the Archive template if not found.
 * Fallback: Archive
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function TaxonomyTemplate(): Promise<JSX.Element> {
    const Taxonomy = await loadTemplate('Taxonomy');
    if (!Taxonomy) return <ArchiveTemplate/>

    return <Taxonomy/>;
}
