import { wpdb } from "nextpress/wpdb/wpdb";
import { ITerm } from "./term.interface";

/**
 * Implementation of ITerm entity.
 */
export class Term implements ITerm
{
    constructor(
        public termId: number
    ) {}

    /** Raw term data from database. */
    private termData?: Record<string, any>;
    /** Map of term meta key-value pairs. */
    private metaMap?: Map<string, string>;

    /**
     * Retrieves array of Term instances by IDs.
     *
     * @param {number[]} ids - Array of term IDs to retrieve.
     * @returns {Promise<Term[]>} Promise resolving to array of Term instances.
     */
    static async get(ids: number[]): Promise<Term[]> {
        ids = ids.filter(Boolean);
        if (!ids || !ids.length) return [];

        const combinedData = await wpdb
            .selectFrom('wpTerms as term')
            .innerJoin('wpTermTaxonomy as taxonomy', 'term.termId', 'taxonomy.termId')
            .where('term.termId', 'in', ids)
            .select([
                'term.termId as termId',
                'term.name as name',
                'term.slug as slug',
                'term.termGroup as termGroup',
                'taxonomy.termTaxonomyId as termTaxonomyId',
                'taxonomy.taxonomy as taxonomy',
                'taxonomy.description as description',
                'taxonomy.parent as parent',
                'taxonomy.count as count'
            ])
            .execute();

        const metaData = await wpdb
            .selectFrom('wpTermmeta')
            .where('termId', 'in', ids)
            .where('metaKey', '=', '_nextpress_path')
            .select(['termId', 'metaKey', 'metaValue'])
            .execute();

        const metaByTermId = new Map<number, Map<string, string>>();
        for (const row of metaData) {
            const termId = Number(row.termId);
            if (!metaByTermId.has(termId)) {
                metaByTermId.set(termId, new Map());
            }
            metaByTermId.get(termId)?.set(row.metaKey || '', row.metaValue || '');
        }

        const combinedDataMap = new Map(combinedData.map(row => [Number(row.termId), row]));

        return ids.map(id => {
            const instance = new Term(id);

            instance.termData = combinedDataMap.get(id);
            instance.metaMap = metaByTermId.get(id) || new Map<string, string>();

            return instance;
        });
    }

    get path(): string { return this.metaMap?.get('_nextpress_path') ?? ''; }
    get name(): string { return this.termData?.['name'] ?? ''; }
    get slug(): string { return this.termData?.['slug'] ?? ''; }
    get termGroup(): number { return this.termData?.['termGroup'] ? Number(this.termData['termGroup']) : 0; }
    get parent(): number { return this.termData?.['parent'] ? Number(this.termData['parent']) : 0; }
    get description(): string { return this.termData?.['description'] ?? ''; }
    get termTaxonomyId(): number { return this.termData?.['termTaxonomyId'] ? Number(this.termData['termTaxonomyId']) : 0; }
    get count(): number { return this.termData?.['count'] ? Number(this.termData['count']) : 0; }
    get taxonomy(): string { return this.termData?.['taxonomy'] ?? ''; }
}
