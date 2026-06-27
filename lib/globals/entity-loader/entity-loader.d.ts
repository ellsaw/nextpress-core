/**
 * Defines the contract for an entity loader.
 *
 * @template EntityT The type of entity being loaded.
 * @template QueryArgsT The type of arguments used for querying the entity.
 */
export interface EntityLoader<EntityT, QueryArgsT> {
    /**
     * Queues entity IDs for loading.
     *
     * @param {number[]} ids Array of entity IDs.
     */
    prime: (ids: number[]) => void;
    /**
     * Finds entity IDs based on query arguments and queues them for loading.
     *
     * @param {QueryArgsT} args Query arguments.
     * @returns {Promise<{ids: number[], count: number}>} Array of found IDs and the total count.
     * @throws {Error} If the query fails.
     */
    findAndPrime: (args: QueryArgsT) => Promise<{ids: number[], count: number}>;
    /**
     * Retrieves entities by their IDs.
     *
     * @param {number[]} ids Array of entity IDs.
     * @returns {Promise<EntityT[]>} Array of entities.
     * @throws {Error} If retrieval fails.
     */
    get: (ids: number[]) => Promise<EntityT[]>;
}

/**
 * Defines the contract for an entity query.
 *
 * @template TArgs The type of query arguments.
 */
export interface EntityQuery<TArgs> {
    /**
     * Executes the query and returns the matching entity IDs.
     *
     * @returns {Promise<number[]>} Array of entity IDs.
     * @throws {Error} If the query fails.
     */
    getIds(): Promise<number[]>;
    /**
     * Retrieves the total count of entities matching the query.
     * @returns {number | undefined} Total count, or undefined if not computed.
     */
    getCount(): number | undefined;
}
