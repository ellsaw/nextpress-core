import { Selectable } from "kysely";
import { WpUser } from "../../types/wpdb/wpdb";

/**
 * Represents user entity.
 */
export interface IUser extends Selectable<WpUser> {
    roles: string[];
    showAdminBar: boolean;
}
