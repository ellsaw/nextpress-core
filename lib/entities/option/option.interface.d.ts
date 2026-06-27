import { Selectable } from "kysely";
import { WpOption } from "../../types/wpdb/wpdb";
import { IFieldLocation } from "../common";

/**
 * Represents option entity.
 */
interface IOption extends Omit<Selectable<WpOption>, 'autoload'> {};
