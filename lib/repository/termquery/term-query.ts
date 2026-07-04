import { QueryCreator } from "kysely";
import { EntityQuery } from "../../globals/entity-loader/entity-loader";
import { ITerm } from "../../entities/term/term.interface";
import { TermQueryArgs } from "./term-query-args";
import { DB } from "@nextpress/wpdb/wpdb.interface";
import { wpdb } from "@nextpress/wpdb/wpdb";

/**
 * Executes database queries to retrieve term IDs based on provided arguments.
 */
export class TermQuery implements EntityQuery<ITerm>
{
    public constructor(
        private args: TermQueryArgs
    ) {}

    public getCount() {
        return undefined;
    }

    public async getIds(): Promise<number[]> {
        let builder = wpdb as QueryCreator<any>;

        const isMultiple = this.args.multiple !== false;

        // -- Build CTEs --
        if (this.args.termId) {
            const termIds = Array.isArray(this.args.termId) ? this.args.termId : [this.args.termId];
            const baseQuery = (qb: any) => qb.selectFrom('wpTermTaxonomy')
                .select(['termId', 'parent'])
                .where((eb: any) => eb.or([
                    eb('termId', 'in', termIds),
                    eb('parent', 'in', termIds)
                ]));

            if (isMultiple) {
                builder = builder.withRecursive('included_branch_id', (qb) =>
                    baseQuery(qb).unionAll(
                        qb.selectFrom('wpTermTaxonomy as t')
                        .select(['t.termId', 't.parent'])
                        .innerJoin('included_branch_id as f', 'f.termId', 't.parent')
                    )
                );
            } else {
                builder = builder.with('included_branch_id', baseQuery);
            }
        }

        if (this.args.termIdNot) {
            const termIds = Array.isArray(this.args.termIdNot) ? this.args.termIdNot : [this.args.termIdNot];
            const baseQuery = (qb: any) => qb.selectFrom('wpTermTaxonomy')
                .select(['termId', 'parent'])
                .where((eb: any) => eb.or([
                    eb('termId', 'in', termIds),
                    eb('parent', 'in', termIds)
                ]));

            if (isMultiple) {
                builder = builder.withRecursive('excluded_branch_id', (qb) =>
                    baseQuery(qb).unionAll(
                        qb.selectFrom('wpTermTaxonomy as t')
                        .select(['t.termId', 't.parent'])
                        .innerJoin('excluded_branch_id as f', 'f.termId', 't.parent')
                    )
                );
            } else {
                builder = builder.with('excluded_branch_id', baseQuery);
            }
        }

        if (this.args.termName) {
            const names = Array.isArray(this.args.termName) ? this.args.termName : [this.args.termName];
            const baseQuery = (qb: any) => qb.selectFrom('wpTermTaxonomy')
                .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                .where('wpTerms.name', 'in', names);

            if (isMultiple) {
                builder = builder.withRecursive('included_branch_name', (qb) =>
                    baseQuery(qb).unionAll(
                        qb.selectFrom('wpTermTaxonomy as t')
                        .select(['t.termId', 't.parent'])
                        .innerJoin('included_branch_name as f', 'f.termId', 't.parent')
                    )
                );
            } else {
                builder = builder.with('included_branch_name', baseQuery);
            }
        }

        if (this.args.termSlug) {
            const slugs = Array.isArray(this.args.termSlug) ? this.args.termSlug : [this.args.termSlug];
            const baseQuery = (qb: any) => qb.selectFrom('wpTermTaxonomy')
                .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                .where('wpTerms.slug', 'in', slugs);

            if (isMultiple) {
                builder = builder.withRecursive('included_branch_slug', (qb) =>
                    baseQuery(qb).unionAll(
                        qb.selectFrom('wpTermTaxonomy as t')
                        .select(['t.termId', 't.parent'])
                        .innerJoin('included_branch_slug as f', 'f.termId', 't.parent')
                    )
                );
            } else {
                builder = builder.with('included_branch_slug', baseQuery);
            }
        }

        if (this.args.termSlugNot) {
            const slugs = Array.isArray(this.args.termSlugNot) ? this.args.termSlugNot : [this.args.termSlugNot];
            const baseQuery = (qb: any) => qb.selectFrom('wpTermTaxonomy')
                .innerJoin('wpTerms', 'wpTerms.termId', 'wpTermTaxonomy.termId')
                .select(['wpTermTaxonomy.termId', 'wpTermTaxonomy.parent'])
                .where('wpTerms.slug', 'in', slugs);

            if (isMultiple) {
                builder = builder.withRecursive('excluded_branch_slug', (qb) =>
                    baseQuery(qb).unionAll(
                        qb.selectFrom('wpTermTaxonomy as t')
                        .select(['t.termId', 't.parent'])
                        .innerJoin('excluded_branch_slug as f', 'f.termId', 't.parent')
                    )
                );
            } else {
                builder = builder.with('excluded_branch_slug', baseQuery);
            }
        }

        // -- Begin Main SELECT Statement --
        let query = (builder as QueryCreator<DB>).selectFrom('wpTerms')
            .innerJoin('wpTermTaxonomy', 'wpTerms.termId', 'wpTermTaxonomy.termId');

        // -- Apply Filters (WHERE clauses) --
        if (this.args.taxonomy) {
            const taxonomies = Array.isArray(this.args.taxonomy) ? this.args.taxonomy : [this.args.taxonomy];
            query = query.where('wpTermTaxonomy.taxonomy', 'in', taxonomies);
        }
        if (this.args.taxonomyId) {
            const ids = Array.isArray(this.args.taxonomyId) ? this.args.taxonomyId : [this.args.taxonomyId];
            query = query.where('wpTermTaxonomy.termTaxonomyId', 'in', ids);
        }

        if (this.args.termId)       query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_id').select('termId'));
        if (this.args.termIdNot)    query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_id').select('termId'));
        if (this.args.termName)     query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_name').select('termId'));
        if (this.args.termSlug)     query = query.where('wpTerms.termId', 'in', (qb: any) => qb.selectFrom('included_branch_slug').select('termId'));
        if (this.args.termSlugNot)  query = query.where('wpTerms.termId', 'not in', (qb: any) => qb.selectFrom('excluded_branch_slug').select('termId'));
        if (this.args.hideEmpty !== false) query = query.where('wpTermTaxonomy.count', '>', 0);

        if (this.args.parent !== undefined) {
            query = query.where('wpTermTaxonomy.parent', '=', this.args.parent);
        }
        if (this.args.childless) {
            query = query.where('wpTerms.termId', 'not in', (qb) =>
                qb.selectFrom('wpTermTaxonomy').select('wpTermTaxonomy.parent').where('wpTermTaxonomy.parent', '>', 0)
            );
        }

        if (this.args.search) {
            const searchStr = `%${this.args.search}%`;
            query = query.where((eb) => eb.or([
                eb('wpTerms.name', 'like', searchStr),
                eb('wpTerms.slug', 'like', searchStr)
            ]));
        }
        if (this.args.nameLike) {
            query = query.where('wpTerms.name', 'like', this.args.nameLike);
        }
        if (this.args.descriptionLike) {
            query = query.where('wpTermTaxonomy.description', 'like', this.args.descriptionLike);
        }

        if (this.args.path) {
            query = query.where((eb) => eb.exists(
                eb.selectFrom('wpTermmeta')
                    .select('wpTerms.termId')
                    .whereRef('wpTermmeta.termId', '=', 'wpTerms.termId')
                    .where('wpTermmeta.metaKey', '=', '_nextpress_path')
                    .where('wpTermmeta.metaValue', '=', this.args.path as string)
            ));
        }

        // -- Apply ORDER BY --
        const orderDirection = this.args.order === 'DESC' ? 'desc' : 'asc';
        const orderBy = this.args.orderBy || 'none';

        switch(orderBy) {
            case 'none': break;
            case 'term_id':     query = query.orderBy('wpTerms.termId', orderDirection); break;
            case 'name':        query = query.orderBy('wpTerms.name', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            case 'slug':        query = query.orderBy('wpTerms.slug', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            case 'term_group':  query = query.orderBy('wpTerms.termGroup', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            case 'description': query = query.orderBy('wpTermTaxonomy.description', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            case 'parent':      query = query.orderBy('wpTermTaxonomy.parent', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            case 'count':       query = query.orderBy('wpTermTaxonomy.count', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
            default:            query = query.orderBy('wpTerms.name', orderDirection).orderBy('wpTerms.termId', orderDirection); break;
        }

        // -- Apply LIMIT & OFFSET --
        const limit = this.args.number ?? 0;
        if (limit > 0) {
            query = query.limit(limit);
        }

        const offsetAmount = this.args.offset ?? 0;
        if (offsetAmount > 0) {
            query = query.offset(offsetAmount);
        }

        if (this.args.metaQuery) {
            let dynamicQuery: any = query;

            for (let metaQuery of this.args.metaQuery) {
                const uniqueAlias = `meta_${metaQuery.as}`;

                dynamicQuery = dynamicQuery.leftJoin(`wpTermmeta as ${uniqueAlias}`, (join: any) =>
                    join
                        .onRef(`${uniqueAlias}.termId`, '=', 'wpTerms.termId')
                        .on(`${uniqueAlias}.metaKey`, '=', metaQuery.metaKey)
                    )
                    .select(`${uniqueAlias}.metaValue as ${metaQuery.as}`);
            }

            query = dynamicQuery;
        }

        try {
            if (isMultiple) {
                return (await query
                    .select('wpTerms.termId')
                    .groupBy('wpTerms.termId')
                    .execute()).map((res: any) => res.termId);
            } else {
                return (await query
                    .select('wpTerms.termId')
                    .execute()).map((res: any) => res.termId);
            }
        } catch (error: any) {
            throw new Error(`WPTermQuery: Cannot get terms: ${error.message}`, { cause: error });
        }
    }
}
