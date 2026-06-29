/**
 * Defines the arguments for querying users.
 * Maps standard WordPress WP_User_Query parameters.
 */
interface UserQueryArgs {
    /** User ID, or array of user IDs, to match when querying terms. */
    userId?: number | number[];
    /** An array of user IDs to exclude. Default empty array. */
    userIdsNotIn?: number[];
    /** The user nicename. Default empty. */
    nicename?: string;
    /** An array of nicenames to include. Default empty array. */
    nicenameIn?: string[];
    /** An array of nicenames to exclude. Default empty array. */
    nicenameNotIn?: string[];
    /** The user display name. Default empty. */
    displayName?: string;
    /** An array of display names to include. Default empty array. */
    displayNameIn?: string[];
    /** An array of display names to exclude. Default empty array. */
    displayNameNotIn?: string[];
    /** The user login. Default empty. */
    login?: string;
    /** An array of logins to include. Default empty array. */
    loginIn?: string[];
    /** An array of logins to exclude. Default empty array. */
    loginNotIn?: string[];
    /** An array of role names. Matched users must have at least one of these roles. Default empty array. */
    roleIn?: string[];
    /** An array of role names that users must match to be included in results. Note that this is an inclusive list: users must match *each* role. Default empty. */
    roleAnd?: string[];
    /** An array of role names to exclude. Users matching one or more of these roles will not be included in results. Default empty array. */
    roleNotIn?: string[];
    /** Search keyword. Searches for possible string matches on columns. */
    search?: string;
    /** Array of column names to be searched. */
    search_columns?: ('ID' | 'userLogin' | 'userEmail' | 'userUrl' | 'userNicename' | 'displayName')[]
    /** Field(s) to order terms by. Default 'none'. */
    orderBy?:
        | 'ID'
        | 'name'
        | 'login'
        | 'nicename'
        | 'first_name'
        | 'last_name'
        | 'email'
        | 'registered'
        | 'post_count'
        | 'count'
        | 'none'
        | string;
    /** Designates ascending or descending order of users. Accepts 'ASC', 'DESC'. Default 'ASC'. */
    order?: 'ASC' | 'DESC';
    /** Number of users to offset in retrieved results. Can be used in conjunction with pagination. Default 0. */
    offset?: number;
    /** Number of users to limit the query for. Value -1 (all) is supported. Default -1. */
    usersPerPage?: number;
    /** Show users that would show up on page. */
    page?: number;
    /** Show all posts (true) or paginate (false). Default false. */
    noPaging?: boolean;
    /** Whether to skip counting the total rows found. Default false. */
    noFoundRows?: boolean;
    /** Pass an array of post types to filter results to users who have published posts in those post types. `true` is an alias for all public post types. */
    hasPublishedPosts?: boolean | string[];
    /** Meta query  */
    metaQuery?: {
        /** Meta key */
        metaKey: string,
        /** Variable name to save result to */
        as: string
    }[]
    /** Whether to get multiple, default false */
    multiple?: boolean
}
