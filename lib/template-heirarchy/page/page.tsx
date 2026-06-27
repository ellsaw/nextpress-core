import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";

/**
 * Loads the metadata for the Page template.
 * Fallback: Singular
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function PageMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Page');
    return {...(await SingularMetadata()), ...metadata};
}

/**
 * Renders the Page template. Falls back to the Singular template if not found.
 * Fallback: Singular
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function PageTemplate(): Promise<JSX.Element> {
    const Page = await loadTemplate('Page');
    if (!Page) return <SingularTemplate/>

    return <Page/>;
}
