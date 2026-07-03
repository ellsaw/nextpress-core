/**
 * Defines the arguments for querying terms.
 * Maps standard WordPress WP_Term_Query parameters.
 */
export interface TermQueryArgs {
    /** Taxonomy name, or array of taxonomy names, to which results should be limited. */
    taxonomy?: string | string[];
    /** Taxonomy ID, or array of term taxonomy IDs, to match when querying terms. */
    taxonomyId?: number | number[];
    /** TermId or array of term IDs to include along with all of their descendant terms. */
    termId?: number | number[];
    /** TermId or array of term IDs to exclude along with all of their descendant terms. */
    termIdNot?: number | number[];
    /** Slug or array of slugs to return term(s) for. Default empty. */
    termSlug?: string | string[];
    /** Slug or array of slugs to return term(s) for. Default empty. */
    termSlugNot?: string | string[];
    /** Name or array of names to return term(s) for. Default empty. */
    termName?: string | string[];
    /** Nextpress path to the term */
    path?: string;
    /** Whether to hide terms not assigned to any posts. Default true. */
    hideEmpty?: boolean;
    /** Field(s) to order terms by. Default 'none'. */
    orderBy?:
        | 'term_id'
        | 'name'
        | 'slug'
        | 'term_group'
        | 'description'
        | 'parent'
        | 'term_order'
        | 'count'
        | 'none'
        | string;
    /** Whether to order terms in ascending or descending order. Default 'ASC'. */
    order?: 'ASC' | 'DESC';
    /** Maximum number of terms to return. Accepts 0 (all) or any positive number. Default 0 (all). */
    number?: number;
    /** The number by which to offset the terms query. Default empty. */
    offset?: number;
    /** Parent term ID to retrieve direct-child terms of. Default empty. */
    parent?: number;
    /** True to limit results to terms that have no children. This parameter has no effect on non-hierarchical taxonomies. Default false. */
    childless?: boolean;
    /** Search criteria to match terms. Will be SQL-formatted with wildcards before and after. Default empty. */
    search?: string;
    /** Retrieve terms with criteria by which a term is LIKE `$nameLike`. Default empty. */
    nameLike?: string;
    /** Retrieve terms where the description is LIKE `$descriptionLike`. Default empty. */
    descriptionLike?: string;
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
