import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";

/**
 * Loads the metadata for the Single template.
 * Fallback: Singular
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function SingleMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Single');
    return {...(await SingularMetadata()), ...metadata};
}

/**
 * Renders the Single template. Falls back to the Singular template if not found.
 * Fallback: Singular
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function SingleTemplate(): Promise<JSX.Element> {
    const Single = await loadTemplate('Single');
    if (!Single) return <SingularTemplate/>

    return <Single/>;
}
