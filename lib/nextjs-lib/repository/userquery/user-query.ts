import { IUser } from "../../entities/user/user.interface";
import { EntityQuery } from "../../globals/entity-loader/entity-loader";
import { sql } from "kysely";
import { UserQueryArgs } from "./user-query-args";
import { wpdb } from "@nextpress/wpdb/wpdb";

/**
 * Executes database queries to retrieve user IDs and counts based on provided arguments.
 */
export class UserQuery implements EntityQuery<IUser>
{
    private userCount?: number;

    constructor(
        private args: UserQueryArgs
    ) {}

    public getCount(): number | undefined {
        return this.userCount;
    }

    public async getIds(): Promise<number[]> {
        let query = wpdb.selectFrom('wpUsers');

        // --- ID Filters ---
        if (this.args.userId) {
            const types = Array.isArray(this.args.userId) ? this.args.userId : [this.args.userId];
            query = query.where('wpUsers.ID', 'in', types);
        }
        if (this.args.userIdsNotIn) query = query.where('wpUsers.ID', 'not in', this.args.userIdsNotIn);

        // --- Nicename Filters ---
        if (this.args.nicename)         query = query.where('wpUsers.userNicename', '=', this.args.nicename);
        if (this.args.nicenameIn)       query = query.where('wpUsers.userNicename', 'in', this.args.nicenameIn);
        if (this.args.nicenameNotIn)    query = query.where('wpUsers.userNicename', 'not in', this.args.nicenameNotIn);

        // --- Display name Filters ---
        if (this.args.displayName)      query = query.where('wpUsers.displayName', '=', this.args.displayName);
        if (this.args.displayNameIn)    query = query.where('wpUsers.displayName', 'in', this.args.displayNameIn);
        if (this.args.displayNameNotIn) query = query.where('wpUsers.displayName', 'not in', this.args.displayNameNotIn);

        // --- Login Filters ---
        if (this.args.login)        query = query.where('wpUsers.userLogin', '=', this.args.login);
        if (this.args.loginIn)      query = query.where('wpUsers.userLogin', 'in', this.args.loginIn);
        if (this.args.loginNotIn)   query = query.where('wpUsers.userLogin', 'not in', this.args.loginNotIn);

        // --- Role Filters ---
        if (this.args.roleIn) {
            query = query
                .innerJoin('wpUsermeta as um_role_in', 'wpUsers.ID', 'um_role_in.userId')
                .where('um_role_in.metaKey', '=', 'wp_capabilities')
                .where((eb) => {
                    const orClauses = this.args.roleIn!.map(role =>
                        eb('um_role_in.metaValue', 'like', `%"${role}"%`)
                    );
                    return eb.or(orClauses);
                });
        }

        if (this.args.roleAnd) {
            this.args.roleAnd.forEach((role, index) => {
                const alias = `um_role_and_${index}` as const;

                query = query
                    .innerJoin(`wpUsermeta as ${alias}`, 'wpUsers.ID', `${alias}.userId`)
                    .where(`${alias}.metaKey`, '=', 'wp_capabilities')
                    .where(`${alias}.metaValue`, 'like', `%"${role}"%`);
            });
        }

        if (this.args.roleNotIn) {
            this.args.roleNotIn.forEach((role, index) => {
                const alias = `um_role_not_${index}` as const;

                query = query
                    .innerJoin(`wpUsermeta as ${alias}`, 'wpUsers.ID', `${alias}.userId`)
                    .where(`${alias}.metaKey`, '=', 'wp_capabilities')
                    .where(`${alias}.metaValue`, 'not like', `%"${role}"%`);
            });
        }

        // --- Search Filters ---
        if (this.args.search) {
            const searchTerm = `%${this.args.search}%`;
            const searchCols = this.args.search_columns || ['ID', 'userLogin', 'userEmail', 'userUrl', 'userNicename', 'displayName'];

            query = query.where((eb) => {
                const orClauses = searchCols.map(col => eb(col, 'like', searchTerm));
                return eb.or(orClauses);
            });
        }

        // --- Published Posts Filter ---
        if (this.args.hasPublishedPosts) {
            query = query.where((eb) => eb(
                eb.selectFrom('wpPosts')
                    .select(eb.fn.count<number>('ID').as('count'))
                    .whereRef('wpPosts.postAuthor', '=', 'wpUsers.ID')
                    .where('wpPosts.postStatus', '=', 'publish'),
                '>', 0
            ));
        }

        // 3. Calculate Total Count (Before Limits/Offsets)
        if (!this.args.noFoundRows) {
            try {
                const countQueryBase = query.clearSelect().select('wpUsers.ID').distinct();
                const countResult = await wpdb.selectFrom(countQueryBase.as('sub'))
                    .select(sql<number>`count(*)`.as('count'))
                    .executeTakeFirst();

                this.userCount = countResult ? Number(countResult.count) : undefined;
            } catch (error: any) {
                console.error('WPUserQuery: Cannot get row count: ', error.message);
                this.userCount = undefined;
            }
        } else {
            this.userCount = undefined;
        }

        // 4. Apply ORDER BY
        const orderDirection = this.args.order === 'DESC' ? 'desc' : 'asc';
        const orderBy = this.args.orderBy || 'none';

        switch(orderBy) {
            case 'ID':         query = query.orderBy('wpUsers.ID', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'name':       query = query.orderBy('wpUsers.displayName', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'login':      query = query.orderBy('wpUsers.userLogin', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'nicename':   query = query.orderBy('wpUsers.userNicename', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'email':      query = query.orderBy('wpUsers.userEmail', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'registered': query = query.orderBy('wpUsers.userRegistered', orderDirection).orderBy('wpUsers.ID', orderDirection); break;
            case 'post_count':
                query = query.orderBy(
                    (eb) => eb.selectFrom('wpPosts')
                            .select(eb.fn.count('ID').as('count'))
                            .whereRef('wpPosts.postAuthor', '=', 'wpUsers.ID')
                            .where('wpPosts.postStatus', '=', 'publish'),
                    orderDirection
                ).orderBy('wpUsers.ID', orderDirection);
                break;
            case 'none': break;
            default:
                query = query.orderBy('wpUsers.userLogin', orderDirection).orderBy('wpUsers.ID', orderDirection);
                break;
        }

        // 5. Apply LIMIT & OFFSET
        if (!this.args.noPaging) {
            const perPage = this.args.usersPerPage ?? -1;

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

                dynamicQuery = dynamicQuery.leftJoin(`wpUsermeta as ${uniqueAlias}`, (join: any) =>
                    join
                        .onRef(`${uniqueAlias}.userId`, '=', 'wpUsers.ID')
                        .on(`${uniqueAlias}.metaKey`, '=', metaQuery.metaKey)
                    )
                    .select(`${uniqueAlias}.metaValue as ${metaQuery.as}`);
            }

            query = dynamicQuery;
        }

        try {
            if (this.args.multiple !== false) {
                return (await query
                    .select('wpUsers.ID as id')
                    .groupBy('wpUsers.ID')
                    .execute()).map(res => res.id);
            } else {
                return (await query
                    .select('wpUsers.ID as id')
                    .execute()).map(res => res.id);
            }
        } catch (error: any) {
            throw new Error(`WPUserQuery: Cannot get users: ${error.message}`, { cause: error });
        }
    }
}
