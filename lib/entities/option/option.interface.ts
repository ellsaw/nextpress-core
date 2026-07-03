import { Selectable } from "kysely";
import { WpOption } from "nextpress/wpdb/wpdb.interface";

/**
 * Represents option entity.
 */
export interface IOption extends Omit<Selectable<WpOption>, 'autoload'> {};
