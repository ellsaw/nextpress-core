import { DB } from "@/wpdb/wpdb.interface";
import { ComparisonOperatorExpression, ReferenceExpression } from "kysely";

/**
 * Defines the arguments for querying options.
 */
export interface OptionQueryArgs {
    /**
     * Database column reference to query against.
     */
    column: ReferenceExpression<DB, "wpOptions">;

    /**
     * Comparison operator for the query.
     */
    operand?: ComparisonOperatorExpression;

    /**
     * Value or array of values to compare.
     */
    value: string | string[];
}
