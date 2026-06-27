import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { notFound } from "next/navigation";
import { queriedObjectState } from "@/globals/globals";
import { AuthorMetadata, AuthorTemplate } from "@/template-heirarchy/archive/author";

/**
 * Resolves the author archive route and maps it to the template hierarchy to return Metadata.
 * * Routing Behavior:
 * - Unconditionally routes to `AuthorMetadata`.
 *
 * @param {{ path: string[], metadata: true }} props - Route properties requesting metadata.
 * @returns {Promise<MetadataResult>} The generated metadata.
 */
export function AuthorArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;

/**
 * Resolves the author archive route and maps it to the template hierarchy to return a Template.
 * * Routing Behavior:
 * - Unconditionally routes to `AuthorTemplate`.
 *
 * @param {{ path: string[], metadata?: false }} props - Route properties requesting a template.
 * @returns {Promise<TemplateResult>} The rendered template component.
 */
export function AuthorArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

/**
 * Core implementation for the author archive route.
 * Retrieves posts published by a specific author and updates the queried object state.
 *
 * @param {RouteProps} props - Route properties including the path array and metadata flag.
 * @returns {Promise<MetadataResult | TemplateResult>} The metadata or template result based on the hierarchy.
 * @throws {Error} Throws a Next.js notFound error if the author is not found.
 */
export async function AuthorArchive({ path, metadata = false }: RouteProps) {
    const postsPerPage = Number(await getOption('posts_per_page')) ?? 10;

    const page = getPageNumber(path) || 1;

    const login = path[1];
    if (!login) notFound();

    const userQuery = await userLoader.findAndPrime({
        login: login,
        multiple: false,
        noFoundRows: true
    });

    const user = await getUser(userQuery.ids[0] ?? 0)
    if (!user) notFound();

    const postIds = await postLoader.findAndPrime({
        authorId: user.ID,
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const currentQueriedObject = {
        objectType: 'user',
        posts: postIds.ids,
        page,
        pageCount: Math.ceil(postIds.count / postsPerPage),
        user: user.ID
    }

    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    return metadata ? await AuthorMetadata() : <AuthorTemplate/>;
}
