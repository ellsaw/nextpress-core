import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "./_autoloader/template-autoloader";

/**
 * Loads the metadata for the Index template.
 * Fallback: None
 *
 * @returns {Promise<Metadata>} The loaded metadata object.
 */
export async function IndexMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Index');
    return metadata ?? {};
}

/**
 * Renders the Index template.
 * Fallback: None
 *
 * @throws {Error} Throws if the Index template cannot be found in the _templates directory.
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function IndexTemplate(): Promise<JSX.Element> {
    const Index = await loadTemplate('Index');
    if (!Index) {
        throw new Error('Nextpress needs an index.tsx file in the template heirarchy in the _templates directory to function');
    }

    return <Index/>;
}
