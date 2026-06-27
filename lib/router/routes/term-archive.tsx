import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { notFound } from "next/navigation";
import { CategoryMetadata, CategoryTemplate } from "@/template-heirarchy/archive/category";
import { TagMetadata, TagTemplate } from "@/template-heirarchy/archive/tag";
import { TaxonomyMetadata, TaxonomyTemplate } from "@/template-heirarchy/archive/taxonomy";
import { queriedObjectState } from "@/globals/globals";

/**
 * Resolves the term archive route and maps it to the template hierarchy to return Metadata.
 * * Routing Behavior:
 * - If the taxonomy is 'category', it routes to `CategoryMetadata`.
 * - If the taxonomy is 'tag', it routes to `TagMetadata`.
 * - For all other taxonomies, it routes to `TaxonomyMetadata`.
 *
 * @param {{ path: string[], metadata: true }} props - Route properties requesting metadata.
 * @returns {Promise<MetadataResult>} The generated metadata.
 */
export function TermArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;

/**
 * Resolves the term archive route and maps it to the template hierarchy to return a Template.
 * * Routing Behavior:
 * - If the taxonomy is 'category', it routes to `CategoryTemplate`.
 * - If the taxonomy is 'tag', it routes to `TagTemplate`.
 * - For all other taxonomies, it routes to `TaxonomyTemplate`.
 *
 * @param {{ path: string[], metadata?: false }} props - Route properties requesting a template.
 * @returns {Promise<TemplateResult>} The rendered template component.
 */
export function TermArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

/**
 * Core implementation for the term archive route.
 * Retrieves posts for a specific taxonomy term and updates the queried object state.
 *
 * @param {RouteProps} props - Route properties including the path array and metadata flag.
 * @returns {Promise<MetadataResult | TemplateResult>} The metadata or template result based on the hierarchy.
 * @throws {Error} Throws a Next.js notFound error if the term does not exist.
 */
export async function TermArchive({ path, metadata = false }: RouteProps) {
    const postsPerPage = Number(await getOption('posts_per_page')) ?? 10;

    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const taxonomy = path[0] ?? '';
    const pathString = path.slice(1).join('/');

    const termQuery = await termLoader.findAndPrime({
        taxonomy,
        path: `/${pathString}`
    });
    if (!termQuery.ids.length) notFound();

    const postIds = await postLoader.findAndPrime({
        termIn: termQuery.ids,
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const terms = await getTerms(termQuery.ids);
    const mainTerm = terms.find(term => term.slug === path[path.length - 1])!;

    const currentQueriedObject = {
        objectType: 'term',
        posts: postIds.ids,
        page,
        pageCount: Math.ceil(postIds.count / postsPerPage),
        mainTerm: mainTerm.termId,
        terms: termQuery.ids
    };

    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    if (taxonomy === 'category') {
        return metadata ? await CategoryMetadata() : <CategoryTemplate/>;
    } else if (taxonomy === 'tag') {
        return metadata ? await TagMetadata() : <TagTemplate/>;
    } else {
        return metadata ? await TaxonomyMetadata() : <TaxonomyTemplate/>;
    }
}
