import { unserialize } from "php-serialize";
import { IUser } from "./user.interface";
import { wpdb } from "nextpress/wpdb/wpdb";

export class User implements IUser {
    constructor(
        public ID: number
    ) {}

    /** Raw user data from database. */
    private userData?: Record<string, any>;
    /** Map of user meta key-value pairs. */
    private metaMap?: Map<string, string>;

    /**
     * Retrieves array of User instances by IDs.
     *
     * @param {number[]} ids - Array of user IDs to retrieve.
     * @returns {Promise<User[]>} Promise resolving to array of User instances.
     */
    static async get(ids: number[]): Promise<User[]> {
        ids = ids.filter(Boolean);
        if (!ids || !ids.length) return [];

        const usersData = await wpdb
            .selectFrom('wpUsers')
            .where('ID', 'in', ids)
            .selectAll()
            .execute();

        const metaData = await wpdb
            .selectFrom('wpUsermeta')
            .where('userId', 'in', ids)
            .where('metaKey', 'in', [
                'wp_capabilities',
                'show_admin_bar_front'
            ])
            .select(['userId', 'metaKey', 'metaValue'])
            .execute();

        const metaByUserId = new Map<number, Map<string, string>>();
        for (const row of metaData) {
            const userId = Number(row.userId);
            if (!metaByUserId.has(userId)) {
                metaByUserId.set(userId, new Map());
            }
            metaByUserId.get(userId)?.set(row.metaKey || '', row.metaValue || '');
        }

        const userDataMap = new Map(usersData.map(user => [Number(user.ID), user]));

        return ids.map(id => {
            const instance = new User(id);

            instance.userData = userDataMap.get(id);
            instance.metaMap = metaByUserId.get(id) || new Map<string, string>();

            return instance;
        });
    }

    get roles(): string[] {
        const rawCapabilities = this.metaMap?.get('wp_capabilities');
        if (!rawCapabilities) return [];
        try {
            return Object.keys(unserialize(rawCapabilities));
        } catch (error: any) {
            console.warn('Error while getting user: Could not unserialize php: ', error.message);
            return [];
        }
    }

    get showAdminBar(): boolean {
        return this.metaMap?.get('show_admin_bar_front') === 'true';
    }

    get displayName(): string { return this.userData?.['displayName'] ?? ''; }
    get userActivationKey(): string { return this.userData?.['userActivationKey'] ?? ''; }
    get userEmail(): string { return this.userData?.['userEmail'] ?? ''; }
    get userLogin(): string { return this.userData?.['userLogin'] ?? ''; }
    get userNicename(): string { return this.userData?.['userNicename'] ?? ''; }
    get userPass(): string { return this.userData?.['userPass'] ?? ''; }
    get userRegistered(): Date { return this.userData?.['userRegistered'] ?? new Date(); }
    get userStatus(): number { return this.userData?.['userStatus'] ? Number(this.userData['userStatus']) : 0; }
    get userUrl(): string { return this.userData?.['userUrl'] ?? ''; }
}
