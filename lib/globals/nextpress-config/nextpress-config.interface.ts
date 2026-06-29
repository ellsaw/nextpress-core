type NextpressConfig = {
    /** Custom taxonomies used to categorize and group content (like categories or tags). Expects the taxonomy's URL prefix, so tag instead of post_tag */
    readonly publicTaxonomies?: string[],

    /** Custom post types registered for public consumption (like posts, pages, or portfolio). */
    readonly publicPostTypes?: string[],

    /** Post types that should display archive pages on the frontend. */
    readonly archivedPostTypes?: string[],

    /** The word/character count limit for automatically generated post teasers. */
    readonly excerptLength?: number,

    /** Database option keys (from wp_options) to fetch early for performance optimization. */
    readonly preLoadOptions?: string[],
} & {
    [key: string]: any;
};
