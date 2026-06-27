import { Selectable } from "kysely";
import { WpTerm, WpTermTaxonomy } from "../../types/wpdb/wpdb";
import { IPath } from "../common";

/**
 * Represents term entity.
 */
export interface ITerm extends Selectable<WpTerm>, Selectable<WpTermTaxonomy>, IPath {}
