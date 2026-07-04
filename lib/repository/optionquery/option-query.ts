import { ComparisonOperatorExpression } from "kysely";
import { EntityQuery } from "../../globals/entity-loader/entity-loader";
import { OptionQueryArgs } from "./option-query-args";
import { IOption } from "../../entities/option/option.interface";
import { wpdb } from "@nextpress/wpdb/wpdb";

/**
 * Executes database queries to retrieve option IDs (or keys) based on provided arguments.
 */
export class OptionQuery implements EntityQuery<IOption>
{
    constructor(
        private args: OptionQueryArgs
    ) {}

    public getCount(): number | undefined {
        return undefined;
    }

    public async getIds(): Promise<number[]> {
        const operand: ComparisonOperatorExpression = this.args.operand || '=';

        return (await wpdb
            .selectFrom('wpOptions')
            .select('optionId')
            .where(this.args.column, operand, this.args.value)
            .execute()).map(option => option.optionId);
    }
}
