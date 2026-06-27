import { DB, WpOption } from "../../types/wpdb/wpdb";

/**
 * Defines the arguments for querying options.
 */
interface OptionQueryArgs {
    /**
     * Database column reference to query against.
     */
    column: ReferenceExpression<DB, WpOption>;

    /**
     * Comparison operator for the query.
     */
    operand?: ComparisonOperatorExpression;

    /**
     * Value or array of values to compare.
     */
    value: string | string[];
}
