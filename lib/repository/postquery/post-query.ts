import { QueryCreator, sql } from "kysely";
import { DB } from "../../types/wpdb/wpdb";
import * as phpSerialize from "php-serialize";
import { EntityQuery } from "../../globals/entity-loader/entity-loader";
import { IPost } from "../../entities/post/post.interface";
import { wpdb } from "@/wpdb/wpdb";

/**
 * Executes database queries to retrieve post IDs and counts based on provided arguments.
 */
export class PostQuery implements EntityQuery<IPost>
{
    private postCount?: number;

    constructor(
        private args: PostQueryArgs
    ) {}

    public getCount(): number | undefined {
        return this.postCount;
    }

    public async getIds(): Promise<number[]> {
        let builder = wpdb as QueryCreator<any>;

        if (this.args.postAncestryOf) {
            builder = builder.withRecursive('decendent_tree', (qb) =>
                qb.selectFrom('wpPosts')
                    .select(['wpPosts.ID', 'wpPosts.postName', 'wpPosts.postParent'])
                    .where('wpPosts.postName', '=', this.args.postAncestryOf)
                    .unionAll(
                        qb.selectFrom('wpPosts as p')
                            .select(['p.ID', 'p.postName', 'p.postParent'])
                            .innerJoin('decendent_tree as d', 'p.postParent', 'd.ID')
                    )
            )
        }

        let query = (builder as QueryCreator<DB>).selectFrom('wpPosts');

        if (this.args.postAncestryOf) {
            query = query.where('wpPosts.postName', 'in', (qb: any) =>
                qb.selectFrom('decendent_tree').select('postName')
            );
        }

        // --- ID Filters ---
        if (this.args.postId)    query = query.where('wpPosts.ID', '=', this.args.postId);
        if (this.args.postIn)    query = query.where('wpPosts.ID', 'in', this.args.postIn);
        if (this.args.postNotIn) query = query.where('wpPosts.ID', 'not in', this.args.postNotIn);

        if (this.args.path) {
            query = query.where((eb) => eb.exists(
                eb.selectFrom('wpPostmeta')
                    .select('postId')
                    .whereRef('postId', '=', 'wpPosts.ID')
                    .where('wpPostmeta.metaKey', '=', '_nextpress_path')
                    .where('wpPostmeta.metaValue', '=', this.args.path as string)
            ));
        }
        // --- Type Filters ---
        if (this.args.postType) {
            const types = Array.isArray(this.args.postType) ? this.args.postType : [this.args.postType];
            query = query.where('wpPosts.postType', 'in', types);
        }
        if (this.args.postTypeNot) {
            const types = Array.isArray(this.args.postTypeNot) ? this.args.postTypeNot : [this.args.postTypeNot];
            query = query.where('wpPosts.postType', 'not in', types);
        }

        // --- Status Filters ---
        if (this.args.postStatus) {
            const statuses = Array.isArray(this.args.postStatus) ? this.args.postStatus : [this.args.postStatus];
            query = query.where('wpPosts.postStatus', 'in', statuses);
        }

        // --- Content Filters ---
        if (this.args.postSlug) {
            const postSlugs = Array.isArray(this.args.postSlug) ? this.args.postSlug : [this.args.postSlug];
            query = query.where('wpPosts.postName', 'in', postSlugs);
        }
        if (this.args.title)        query = query.where('wpPosts.postTitle', '=', this.args.title);
        if (this.args.postMimeType) query = query.where('wpPosts.postMimeType', 'like', `%${this.args.postMimeType}%`);

        // --- Parent Filters ---
        if (this.args.postParent !== undefined)  query = query.where('wpPosts.postParent', '=', this.args.postParent);
        if (this.args.postParentIn)              query = query.where('wpPosts.postParent', 'in', this.args.postParentIn);
        if (this.args.postParentNotIn)           query = query.where('wpPosts.postParent', 'not in', this.args.postParentNotIn);

        // --- Term Filters ---
        if (this.args.termId) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .where('wpTermRelationships.termTaxonomyId', '=', this.args.termId);
        }
        if (this.args.termAnd) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .where('wpTermRelationships.termTaxonomyId', 'in', this.args.termAnd)
                        .groupBy('wpPosts.ID')
                        .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', this.args.termAnd!.length);
        }
        if (this.args.termIn) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .where('wpTermRelationships.termTaxonomyId', 'in', this.args.termIn);
        }
        if (this.args.termNotIn) {
            query = query.where('wpPosts.ID', 'not in',
                (qb) =>
                    qb.selectFrom('wpTermRelationships')
                        .select('wpTermRelationships.objectId')
                        .where('wpTermRelationships.termTaxonomyId', 'in', this.args.termNotIn!)
            );
        }
        if (this.args.termSlug) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                        .where('wpTerms.slug', '=', this.args.termSlug)
                        .groupBy('wpPosts.ID');
        }
        if (this.args.termSlugAnd) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                        .where('wpTerms.slug', 'in', this.args.termSlugAnd)
                        .groupBy('wpPosts.ID')
                        .having((eb) => eb.fn.count('wpTermRelationships.termTaxonomyId'), '=', this.args.termSlugAnd!.length);
        }
        if (this.args.termSlugIn) {
            query = query.innerJoin('wpTermRelationships', 'wpPosts.ID', 'wpTermRelationships.objectId')
                        .innerJoin('wpTerms', 'wpTermRelationships.termTaxonomyId', 'wpTerms.termId')
                        .where('wpTerms.slug', 'in', this.args.termSlugIn)
                        .groupBy('wpPosts.ID');
        }

        // --- Author Filters ---
        if (this.args.authorId)      query = query.where('wpPosts.postAuthor', '=', this.args.authorId);
        if (this.args.authorIn)      query = query.where('wpPosts.postAuthor', 'in', this.args.authorIn);
        if (this.args.authorNotIn)   query = query.where('wpPosts.postAuthor', 'not in', this.args.authorNotIn);
        if (this.args.authorName) {
            query = query.innerJoin('wpUsers', 'wpPosts.postAuthor', 'wpUsers.ID')
                        .where('wpUsers.displayName', '=', this.args.authorName);
        }

        // --- Search Filters ---
        if (this.args.search) {
            const searchTerm = this.args.exact ? this.args.search : `%${this.args.search}%`;
            const searchCols = this.args.searchColumns || ['postTitle', 'postContent', 'postExcerpt'];
            const isExact = this.args.exact;

            query = query.where((eb) => {
                const orClauses = searchCols.map(col => eb(col, isExact ? '=' : 'like', searchTerm));
                return eb.or(orClauses);
            });
        }

        // --- Date Filters ---
        if (this.args.yyyymm) {
            const mStr = String(this.args.yyyymm);
            const y = Number(mStr.substring(0, 4));
            const mon = Number(mStr.substring(4, 6));
            query = query.where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', y)
                        .where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', mon);
        }
        if (this.args.year)                 query = query.where((eb) => eb.fn('YEAR', [eb.ref('wpPosts.postDate')]), '=', this.args.year);
        if (this.args.monthnum)             query = query.where((eb) => eb.fn('MONTH', [eb.ref('wpPosts.postDate')]), '=', this.args.monthnum);
        if (this.args.w)                    query = query.where((eb) => eb.fn('WEEK', [eb.ref('wpPosts.postDate')]), '=', this.args.w);
        if (this.args.day)                  query = query.where((eb) => eb.fn('DAY', [eb.ref('wpPosts.postDate')]), '=', this.args.day);
        if (this.args.hour !== undefined)   query = query.where((eb) => eb.fn('HOUR', [eb.ref('wpPosts.postDate')]), '=', this.args.hour);
        if (this.args.minute !== undefined) query = query.where((eb) => eb.fn('MINUTE', [eb.ref('wpPosts.postDate')]), '=', this.args.minute);
        if (this.args.second !== undefined) query = query.where((eb) => eb.fn('SECOND', [eb.ref('wpPosts.postDate')]), '=', this.args.second);

        // -- Calculate Total Count (Before Limits/Offsets) --
        if (!this.args.noFoundRows) {
            try {
                const countQueryBase = query.clearSelect().select('wpPosts.ID').distinct();
                const countResult = await wpdb.selectFrom(countQueryBase.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();

                this.postCount = countResult ? Number(countResult.count) : undefined;
            } catch (error: any) {
                console.error('WPPostQuery: Cannot get row count: ', error.message);
                this.postCount = undefined;
            }
        } else {
            this.postCount = undefined;
        }

        // -- Apply ORDER BY --
        if (!this.args.ignoreStickyPosts) {
            const rawStickyPostIds = await getOption('sticky_posts');

            let stickyPosts: number[] = [];
            try {
                const parsed = phpSerialize.unserialize(rawStickyPostIds ?? 'a:0:{}');
                stickyPosts = Object.values(parsed as Record<string, number> | number[]);
            } catch (error) {
                console.warn('WPPostQuery: Failed to parse sticky_posts option. Defaulting to empty.', error);
            }

            if (stickyPosts.length > 0) {
                query = query.orderBy(
                    sql`CASE WHEN wp_posts.ID IN (${sql.join(stickyPosts)}) THEN 0 ELSE 1 END`,
                    'asc'
                );
            }
        }

        const orderDirection = this.args.order === 'ASC' ? 'asc' : 'desc';
        const orderBy = this.args.orderBy || 'none';

        switch(orderBy) {
            case 'none': break;
            case 'id':              query = query.orderBy('wpPosts.ID', orderDirection); break;
            case 'author':          query = query.orderBy('wpPosts.postAuthor', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'title':           query = query.orderBy('wpPosts.postTitle', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'name':            query = query.orderBy('wpPosts.postName', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'date':            query = query.orderBy('wpPosts.postDate', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'modified':        query = query.orderBy('wpPosts.postModified', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'parent':          query = query.orderBy('wpPosts.postParent', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'menuOrder':       query = query.orderBy('wpPosts.menuOrder', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'commentCount':    query = query.orderBy('wpPosts.commentCount', orderDirection).orderBy('wpPosts.ID', orderDirection); break;
            case 'rand':            query = query.orderBy((eb) => eb.fn('RAND', [])).orderBy('wpPosts.ID', orderDirection); break;
            default:
                if (orderBy.startsWith('RAND(')) {
                    const seed = parseInt(orderBy.replace(/\D/g, ''), 10);
                    query = query.orderBy((eb) => eb.fn('RAND', [eb.val(seed)])).orderBy('wpPosts.ID', orderDirection);
                } else {
                    query = query.orderBy('wpPosts.postDate', orderDirection).orderBy('wpPosts.ID', orderDirection);
                }
                break;
        }

        // -- Apply LIMIT & OFFSET --
        if (!this.args.noPaging) {
            const perPage = this.args.postsPerPage ?? 10;

            if (perPage > -1) {
                query = query.limit(perPage);

                const page = this.args.page ?? 1;
                const baseOffset = this.args.offset ?? 0;
                const offsetAmount = ((page - 1) * perPage) + baseOffset;

                if (offsetAmount > 0) {
                    query = query.offset(offsetAmount);
                }
            }
        }

        if (this.args.metaQuery) {
            let dynamicQuery: any = query;

            for (let metaQuery of this.args.metaQuery) {
                const uniqueAlias = `meta_${metaQuery.as}`;

                dynamicQuery = dynamicQuery.leftJoin(`wpPostmeta as ${uniqueAlias}`, (join: any) =>
                    join
                        .onRef(`${uniqueAlias}.postId`, '=', 'wpPosts.ID')
                        .on(`${uniqueAlias}.metaKey`, '=', metaQuery.metaKey)
                    )
                    .select(`${uniqueAlias}.metaValue as ${metaQuery.as}`);
            }

            query = dynamicQuery;
        }

        try {
            if(this.args.multiple !== false) {
                return (await query
                    .select('wpPosts.ID as id')
                    .groupBy('wpPosts.ID')
                    .execute()).map(res => res.id);
            } else {
                return (await query
                    .select('wpPosts.ID as id')
                    .execute()).map(res => res.id);
            }
        } catch (error: any) {
            throw new Error(`WPPostQuery: Cannot get posts: ${error.message}`, { cause: error });
        }
    }
}
