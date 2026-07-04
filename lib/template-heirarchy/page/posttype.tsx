import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";
import { capitalizeFirstLetter } from "@nextpress/services/utilities/capitalise-first-letter";

/**
 * Loads the metadata for a Post Type template based on the provided post type string.
 * Fallback: Singular
 *
 * @param {object} props - The properties for loading metadata.
 * @param {string} props.postType - The post type to load metadata for.
 * @returns {Promise<Metadata>} The merged metadata object.
 */
export async function PostTypeMetadata({postType}: {postType: string}): Promise<Metadata> {
    const metadata = await loadMetadata(capitalizeFirstLetter(postType));
    return {...(await SingularMetadata()), ...metadata};
}

/**
 * Renders a Post Type template based on the provided post type string. Falls back to Singular template if not found.
 * Fallback: Singular
 *
 * @param {object} props - The properties for rendering the template.
 * @param {string} props.postType - The post type to load the template for.
 * @returns {Promise<JSX.Element>} The rendered template component.
 */
export async function PostTypeTemplate({postType}: {postType: string}): Promise<JSX.Element> {
    const PostType = await loadTemplate(capitalizeFirstLetter(postType));
    if (!PostType) return <SingularTemplate/>

    return <PostType/>;
}

