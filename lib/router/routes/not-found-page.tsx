import { NotFoundMetadata, NotFoundTemplate } from "@/template-heirarchy/not-found.tsx/not-found";
import { Metadata } from "next";

/**
 * Generates the metadata for the generic Not Found page.
 * Maps to the Nextpress `NotFoundMetadata` which falls back to `IndexMetadata`.
 *
 * @returns {Promise<Metadata>} The generated metadata object.
 */
export async function notFoundMetadata(): Promise<Metadata> {
    return await NotFoundMetadata();
}

/**
 * Default Not Found component to handle unmatched routes.
 * Maps to the Nextpress `NotFoundTemplate` which defaults back to `IndexTemplate` if not defined.
 *
 * @returns {Promise<JSX.Element>} The rendered Not Found template.
 */
export async function NotFoundPage() {
    return <NotFoundTemplate/>
}
