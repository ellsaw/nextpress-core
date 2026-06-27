import { splitPath } from "./helpers";
import { NextpressRouterProps } from "./router";

export type NextpressStaticParams = Awaited<NextpressRouterProps['params']>[];

const { publicPostTypes, archivedPostTypes } = nextpressConfig;

/**
 * Generates static parameters for Next.js build-time prerendering.
 * Queries authors, terms, and posts to generate a comprehensive list of all active routes.
 *
 * @returns {NextpressStaticParams} An array containing the route parameters to be generated statically.
 */
export async function nextpressStaticParams(): Promise<NextpressStaticParams> {
    const { ids: authorIds } = await userLoader.findAndPrime({
        hasPublishedPosts: true,
        noFoundRows: false,
        noPaging: false,
    });
    const authors = await getUsers(authorIds);
    const authorPaths = authors.map((author) => ['author', author.userLogin]);

    const { ids: termIds } = await termLoader.findAndPrime({});
    const terms = await getTerms(termIds);
    const termPaths = terms.map(term => [term.taxonomy, ...splitPath(term.path)]);

    const { ids: archivedPostIds } = await postLoader.findAndPrime({
        postStatus: 'publish',
        postType: archivedPostTypes?.filter(p => !publicPostTypes?.includes(p)) ?? 'post',
        ignoreStickyPosts: true,
        noFoundRows: true,
        noPaging: true,
    });
    const { ids: postIds } = await postLoader.findAndPrime({
        postStatus: 'publish',
        postType: archivedPostTypes ?? 'post',
        ignoreStickyPosts: true,
        noFoundRows: true,
        noPaging: true,
    });

    const archivedPosts = await getPosts(archivedPostIds);
    const posts = await getPosts(postIds);

    const archivedPostsPaths = archivedPosts.map(post => splitPath(post.path));

    const archivedPostArchivePaths = (archivedPostTypes ?? []).map(type => [type]);

    const postPaths = posts.map(post => splitPath(post.path));

    const allPaths = [
        ...authorPaths,
        ...termPaths,
        ...archivedPostsPaths,
        ...archivedPostArchivePaths,
        ...postPaths
    ];

    return allPaths.map(segments => ({
        path: segments.filter(Boolean)
    }));
}
