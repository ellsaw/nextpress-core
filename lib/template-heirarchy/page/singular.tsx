import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

/**
 * Loads the metadata for the Singular template.
 * Fallback: Index
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function SingularMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Singular');
    return {...(await IndexMetadata()), ...metadata}
}

/**
 * Renders the Singular template. Falls back to the Index template if not found.
 * Fallback: Index
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function SingularTemplate(): Promise<JSX.Element> {
    const Singular = await loadTemplate('Singular');
    if (!Singular) return <IndexTemplate/>

    return <Singular {...queriedObject} />;
}
