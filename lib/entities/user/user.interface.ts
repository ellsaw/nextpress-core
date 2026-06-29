import { Selectable } from "kysely";
import { WpUser } from "../../wpdb/wpdb.interface";

/**
 * Represents user entity.
 */
export interface IUser extends Selectable<WpUser> {
    roles: string[];
    showAdminBar: boolean;
}
