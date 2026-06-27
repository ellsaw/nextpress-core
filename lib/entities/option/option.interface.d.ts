import { Selectable } from "kysely";
import { WpOption } from "../../wpdb/wpdb.interface";
import { IFieldLocation } from "../common";

/**
 * Represents option entity.
 */
interface IOption extends Omit<Selectable<WpOption>, 'autoload'> {};
