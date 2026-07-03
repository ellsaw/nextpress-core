import { OptionQuery } from "nextpress/repository/optionquery/option-query";
import { Option } from "../../entities/option/option";
import { IOption } from "../../entities/option/option.interface";
import { OptionQueryArgs } from "../../repository/optionquery/option-query-args";
import { EntityLoader } from "./entity-loader";
import { EntityLoaderBase } from "./entity-loader-base";

class OptionLoader extends EntityLoaderBase<IOption, OptionQueryArgs> {
    private static _instance: OptionLoader;

    protected queryClass = OptionQuery;

    private constructor() {
        super();
    }

    public static instance(): OptionLoader {
        if (!this._instance) {
            this._instance = new OptionLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IOption[]> {
        return await Option.get(ids);
    }

    protected getEntityId(option: IOption): number {
        return option.optionId;
    }
}

declare global {
    /** Global instance of the OptionLoader. */
    var optionLoader: EntityLoader<IOption, OptionQueryArgs>

    /**
     * Retrieves an option value by name.
     *
     * @param {string} name The option name.
     *
     * @returns {Promise<string | undefined>} The option value or undefined.
     */
    var getOption: (name: string) => Promise<string | undefined>;
}

globalThis.optionLoader = OptionLoader.instance();
globalThis.getOption = async (name) => {
    const foundOptions = await optionLoader.findAndPrime({
        column: 'optionName',
        operand: '=',
        value: name
    })

    return (await optionLoader.get(foundOptions.ids))[0]?.optionValue;
}
