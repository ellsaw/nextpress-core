import { Metadata } from "next";
import { NotFoundMetadata, NotFoundTemplate } from "@nextpress/template-heirarchy/not-found.tsx/not-found";

/**
 * Generates the metadata for the generic Not Found page.
 * Maps to the Nextpress `NotFoundMetadata` which falls back to `IndexMetadata`.
 *
 * @returns {Promise<Metadata>} The generated metadata object.
 */
export async function NextpressNotFoundMetadata(): Promise<Metadata> {
    return await NotFoundMetadata();
}

/**
 * Default Not Found component to handle unmatched routes.
 * Maps to the Nextpress `NotFoundTemplate` which defaults back to `IndexTemplate` if not defined.
 *
 * @returns {Promise<JSX.Element>} The rendered Not Found template.
 */
export async function NextpressNotFoundRoute() {
    return <NotFoundTemplate/>
}
