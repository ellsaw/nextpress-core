type WPQueryOrderByParam =
    | 'none' | 'id' | 'author' | 'title' | 'name' | 'date' | 'modified'
    | 'parent' | 'menuOrder'| 'commentCount' | 'rand' | `RAND(${number})`
    | (string & {});

/**
 * Defines the arguments for querying posts.
 * Maps standard WordPress WP_Query parameters.
 */
export interface PostQueryArgs {
    /** Post ID. */
    postId?: number;
    /** An array of post IDs to retrieve, sticky posts will be included. */
    postIn?: number[];
    /** An array of post IDs not to retrieve. */
    postNotIn?: number[];
    /** Path to post */
    path?: string;
    /** A post type slug (string) or array of post type slugs. */
    postType?: string | string[];
    /** A post type slug (string) or array of post type slugs to NOT include. */
    postTypeNot?: string | string[];
    /** A post status (string) or array of post statuses. */
    postStatus?: string | string[];
    /** A post slug (string) or array of post slugs. */
    postSlug?: string | string[];
    /** A post id to retrieve anscestry tree off */
    postAncestryOf?: string;
    /** Post title. */
    title?: string;
    /** The mime type of the post. Used for 'attachment' post_type. */
    postMimeType?: string;
    /** Page ID to retrieve child pages for. Use 0 to only retrieve top-level pages. */
    postParent?: number;
    /** An array containing parent page IDs to query child pages from. */
    postParentIn?: number[];
    /** An array containing parent page IDs not to query child pages from. */
    postParentNotIn?: number[];
    /** Term ID. */
    termId?: number;
    /** An array of term IDs (AND in). */
    termAnd?: number[];
    /** An array of term IDs (OR in). */
    termIn?: number[];
    /** An array of term IDs (NOT in). */
    termNotIn?: number[];
    /** Use term slug (not name, this or any children). */
    termSlug?: string;
    /** An array of term slugs (AND in). */
    termSlugAnd?: string[];
    /** An array of term slugs (OR in). */
    termSlugIn?: string[];
    /** Author ID. */
    authorId?: number;
    /** User 'user_nicename'. */
    authorName?: string;
    /** An array of author IDs to query from. */
    authorIn?: number[];
    /** An array of author IDs not to query from. */
    authorNotIn?: number[];
    /** search keyword(s). */
    search?: string;
    /** Whether to search by exact keyword. Default false. */
    exact?: boolean;
    /** array of column names to be searched. accepts 'postTitle', 'postExcerpt' and 'postContent'. */
    searchColumns?: ('postTitle' | 'postExcerpt' | 'postContent')[];
    /** Combination YearMonth. Accepts any four-digit year and month numbers 01-12. */
    yyyymm?: number;
    /** The four-digit year. Default empty. Accepts any four-digit year. */
    year?: number;
    /** The two-digit month. Default empty. Accepts numbers 1-12. */
    monthnum?: number;
    /** The week number of the year. Default empty. Accepts numbers 0-53. */
    w?: number;
    /** Day of the month. Default empty. Accepts numbers 1-31. */
    day?: number;
    /** Hour of the day. Default empty. Accepts numbers 0-23. */
    hour?: number;
    /** Minute of the hour. Default empty. Accepts numbers 0-59. */
    minute?: number;
    /** Second of the minute. Default empty. Accepts numbers 0-59. */
    second?: number;
    /** Whether to ignore sticky posts or not. Default false. */
    ignoreStickyPosts?: boolean;
    /** Designates ascending or descending order of posts. Default 'DESC'. */
    order?: 'ASC' | 'DESC';
    /** Sort retrieved posts by parameter. */
    orderBy?: WPQueryOrderByParam;
    /** Show posts that would show up on page X of a static front page. */
    page?: number;
    /** Show all posts (true) or paginate (false). Default false. */
    noPaging?: boolean;
    /** The number of posts to offset before retrieval. */
    offset?: number;
    /** The number of posts to query for. Use -1 to request all posts. */
    postsPerPage?: number;
    /** Whether to skip counting the total rows found. Default false. */
    noFoundRows?: boolean;
    /** Meta query  */
    metaQuery?: {
        /** Meta key */
        metaKey: string,
        /** Variable name to save result to */
        as: string
    }[]
    /** Whether to get multiple, default true */
    multiple?: boolean
}
