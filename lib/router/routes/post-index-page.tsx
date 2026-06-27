import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { queriedObjectState } from "@/globals/globals";
import { HomeMetadata, HomeTemplate } from "@/template-heirarchy/home/home";

/**
 * Resolves the post index page (blog home) route and maps it to the template hierarchy to return Metadata.
 * * Routing Behavior:
 * - Unconditionally routes to `HomeMetadata`.
 *
 * @param {{ path: string[], metadata: true }} props - Route properties requesting metadata.
 * @returns {Promise<MetadataResult>} The generated metadata.
 */
export function PostIndexPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;

/**
 * Resolves the post index page (blog home) route and maps it to the template hierarchy to return a Template.
 * * Routing Behavior:
 * - Unconditionally routes to `HomeTemplate`.
 *
 * @param {{ path: string[], metadata?: false }} props - Route properties requesting a template.
 * @returns {Promise<TemplateResult>} The rendered template component.
 */
export function PostIndexPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

/**
 * Core implementation for the post index page route.
 * Fetches the paginated list of all published posts and updates the queried object state.
 *
 * @param {RouteProps} props - Route properties including the path array and metadata flag.
 * @returns {Promise<MetadataResult | TemplateResult>} The metadata or template result based on the hierarchy.
 */
export async function PostIndexPage({ path, metadata = false }: RouteProps) {
    const page = getPageNumber(path) || 1;
    const postsPerPage = Number(await getOption('posts_per_page')) ?? 10;

    const postIds = await postLoader.findAndPrime({
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const currentQueriedObject = {
        posts: postIds.ids,
        page,
        pageCount: postIds.count / postsPerPage
    }

    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    return metadata ? await HomeMetadata() : <HomeTemplate/>;
}

