import { wpdb } from "@nextpress/wpdb/wpdb";
import { IOption } from "./option.interface";

/**
 * Implementation of IOption entity.
 */
export class Option implements IOption
{
    constructor(public optionId: number) {};

    /** Raw option data from database. */
    private optionData?: Record<string, any>;

    /**
     * Retrieves array of Option instances by IDs.
     *
     * @param {number[]} ids - Array of option IDs to retrieve.
     * @returns {Promise<Option[]>} Promise resolving to array of Option instances.
     */
    static async get(ids: number[]): Promise<Option[]> {
        ids = ids.filter(Boolean);
        if (!ids || !ids.length) return [];

        const optionData = await wpdb
            .selectFrom('wpOptions')
            .where('optionId', 'in', ids)
            .select(['optionId', 'optionName', 'optionValue'])
            .execute();

        const optionDataMap = new Map(optionData.map(option => [Number(option.optionId), option]));

        return ids.map(id => {
            const instance = new Option(id);

            instance.optionData = optionDataMap.get(id);

            return instance;
        })
    }

    get optionName(): string { return this.optionData?.['optionName'] ?? ''};
    get optionValue(): string { return this.optionData?.['optionValue'] ?? ''};
}
