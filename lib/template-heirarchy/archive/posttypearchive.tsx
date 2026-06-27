import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";
import { capitalizeFirstLetter } from "@/services/utilities/capitalise-first-letter";

/**
 * Loads the metadata for a Post Type Archive template based on the given post type.
 * Fallback: Archive
 *
 * @param {object} props - The properties for loading metadata.
 * @param {string} props.postType - The post type to load the metadata for.
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function PostTypeArchiveMetadata({postType}: {postType: string}): Promise<Metadata> {
    const metadata = await loadMetadata(capitalizeFirstLetter(postType));
    return {...(await ArchiveMetadata()), ...metadata};
}

/**
 * Renders a Post Type Archive template. Falls back to the Archive template if not found.
 * Fallback: Archive
 *
 * @param {object} props - The properties for rendering the template.
 * @param {string} props.postType - The post type to load the template for.
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function PostTypeArchiveTemplate({postType}: {postType: string}): Promise<JSX.Element> {
    const PostTypeArchive = await loadTemplate(capitalizeFirstLetter(postType));
    if (!PostTypeArchive) return <ArchiveTemplate/>

    return <PostTypeArchive/>;
}
