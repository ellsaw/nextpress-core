/**
 * Represents entity with a path.
 */
export interface IPath {
    /** Nextpress path to entity. */
    path: string
}

/**
 * Array of field key-value pairs.
 */
export type Fields = {
    /** Field key. */
    key: string,
    /** Field value. */
    value: string
}[];

/**
 * Represents entity that can provide ACF fields.
 */
export interface IFieldLocation {
    /**
     * Retrieves fields matching a name prefix.
     *
     * @param {string} name - Field name prefix to search for.
     * @returns {Promise<Fields>} Promise resolving to array of fields.
     */
    getFields: (name: string) => Promise<Fields>
}
