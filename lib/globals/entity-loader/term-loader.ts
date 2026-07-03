import { ITerm } from "../../entities/term/term.interface";
import { Term } from "../../entities/term/term";
import { EntityLoader } from "./entity-loader";
import { EntityLoaderBase } from "./entity-loader-base";
import { TermQueryArgs } from "nextpress/repository/termquery/term-query-args";
import { TermQuery } from "nextpress/repository/termquery/term-query";

class TermLoader extends EntityLoaderBase<ITerm, TermQueryArgs> {
    private static _instance: TermLoader;

    protected queryClass = TermQuery;

    private constructor() {
        super();
    }

    public static instance(): TermLoader {
        if (!this._instance) {
            this._instance = new TermLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<ITerm[]> {
        return await Term.get(ids);
    }

    protected getEntityId(term: ITerm): number {
        return term.termId;
    }
}

declare global {
    /** Global instance of the TermLoader. */
    var termLoader: EntityLoader<ITerm, TermQueryArgs>
    /**
     * Retrieves terms by their IDs.
     *
     * @param {number[]} ids Array of term IDs.
     * @returns {Promise<ITerm[]>} Array of terms.
     */
    var getTerms: (ids: number[]) => Promise<ITerm[]>
    /**
     * Retrieves a single term by ID.
     *
     * @param {number} id The term ID.
     * @returns {Promise<ITerm | undefined>} The term or undefined.
     */
    var getTerm: (id: number) => Promise<ITerm | undefined>
}

globalThis.termLoader = TermLoader.instance();
globalThis.getTerms = async (ids) => {
    return await termLoader.get(ids);
}
globalThis.getTerm = async (id) => {
    return (await termLoader.get([id]))[0];
}

export {};
