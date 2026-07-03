import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";
import { getPageNumber } from "../helpers";
import { notFound } from "next/navigation";
import { queriedObjectState } from "nextpress/globals/globals";
import { SingleMetadata, SingleTemplate } from "nextpress/template-heirarchy/page/single";
import { PageMetadata, PageTemplate } from "nextpress/template-heirarchy/page/page";

/**
 * Resolves the singular page route and maps it to the template hierarchy to return Metadata.
 * * Routing Behavior:
 * - If the post_type is 'post', it routes to `SingleMetadata`.
 * - If the post ID matches the 'page_for_posts' option, it delegates routing to `PostIndexPage`.
 * - Otherwise, it defaults to routing to `PageMetadata`.
 *
 * @param {{ path: string[], metadata: true }} props - Route properties requesting metadata.
 * @returns {Promise<MetadataResult>} The generated metadata.
 */
export function SingularPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;

/**
 * Resolves the singular page route and maps it to the template hierarchy to return a Template.
 * * Routing Behavior:
 * - If the post_type is 'post', it routes to `SingleTemplate`.
 * - If the post ID matches the 'page_for_posts' option, it delegates routing to `PostIndexPage`.
 * - Otherwise, it defaults to routing to `PageTemplate`.
 *
 * @param {{ path: string[], metadata?: false }} props - Route properties requesting a template.
 * @returns {Promise<TemplateResult>} The rendered template component.
 */
export function SingularPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

/**
 * Core implementation for the singular page/post route.
 * Resolves the path to a specific post ID and updates the queried object state.
 *
 * @param {RouteProps} props - Route properties including the path array and metadata flag.
 * @returns {Promise<MetadataResult | TemplateResult>} The metadata or template result based on the hierarchy.
 * @throws {Error} Throws a Next.js notFound error if the path does not match any post or page.
 */
export async function SingularPage({ path, metadata = false }: RouteProps) {
    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const postId = (await postLoader.findAndPrime({
        path: `/${path.join('/')}`,
        multiple: false,
        noFoundRows: true,
        noPaging: true,
        ignoreStickyPosts: true,
    })).ids[0];
    if (!postId) notFound();

    const post = await getPost(postId) ?? notFound()

    const postType = post.postType

    const currentQueriedObject = {
        objectType: 'post',
        posts: [postId]
    }
    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    if (postType === 'post') {
        return metadata ? await SingleMetadata() : <SingleTemplate/>;
    }
    if (post.ID !== Number(await getOption('page_for_posts'))) {
        return metadata ? await PageMetadata() : <PageTemplate/>;
    } else {
        return metadata ? await PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    }
}

