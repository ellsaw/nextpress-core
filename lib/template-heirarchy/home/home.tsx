import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

/**
 * Loads the metadata for the Home template.
 * Fallback: Index
 *
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function HomeMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Home');
    return {...(await IndexMetadata()), ...metadata};
}

/**
 * Renders the Home template. Falls back to the Index template if not found.
 * Fallback: Index
 *
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function HomeTemplate(): Promise<JSX.Element> {
    const Home = await loadTemplate('Home');
    if (!Home) return <IndexTemplate/>

    return <Home/>;
}
