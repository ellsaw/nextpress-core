import { queriedObjectState } from "@nextpress/globals/globals";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";
import { PageMetadata, PageTemplate } from "@nextpress/template-heirarchy/page/page";

/**
 * Resolves the site front page route and maps it to the template hierarchy to return Metadata.
 * * Routing Behavior:
 * - If a static page is set as the homepage ('page_on_front'), it routes to `PageMetadata`.
 * - If no static page is set, it delegates routing to `PostIndexPage`.
 *
 * @param {{ path: string[], metadata: true }} props - Route properties requesting metadata.
 * @returns {Promise<MetadataResult>} The generated metadata.
 */
export function SiteFrontPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;

/**
 * Resolves the site front page route and maps it to the template hierarchy to return a Template.
 * * Routing Behavior:
 * - If a static page is set as the homepage ('page_on_front'), it routes to `PageTemplate`.
 * - If no static page is set, it delegates routing to `PostIndexPage`.
 *
 * @param {{ path: string[], metadata?: false }} props - Route properties requesting a template.
 * @returns {Promise<TemplateResult>} The rendered template component.
 */
export function SiteFrontPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

/**
 * Core implementation for the site front page (root) route.
 * Checks for a configured static front page and updates the queried object state.
 *
 * @param {RouteProps} props - Route properties including the path array and metadata flag.
 * @returns {Promise<MetadataResult | TemplateResult>} The metadata or template result based on the hierarchy.
 */
export async function SiteFrontPage({ path, metadata = false }: RouteProps) {
    const homepageId = Number(await getOption('page_on_front'));

    if (homepageId) {
        const currentQueriedObject = {
            objectType: 'post',
            posts: [homepageId]
        }

        const state = queriedObjectState();
        state.currentState = currentQueriedObject;

        return metadata ? await PageMetadata() : <PageTemplate/>;
    } else {
        return metadata ? await PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    }
}
