import { Selectable } from "kysely";
import { IPath } from "../common";
import { WpTerm, WpTermTaxonomy } from "nextpress/wpdb/wpdb.interface";

/**
 * Represents term entity.
 */
export interface ITerm extends Selectable<WpTerm>, Selectable<WpTermTaxonomy>, IPath {}
