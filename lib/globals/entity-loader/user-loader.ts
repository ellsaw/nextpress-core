import { User } from "@/entities/user/user";
import { IUser } from "../../entities/user/user.interface";
import { EntityLoader } from "./entity-loader.interface";
import { EntityLoaderBase } from "./entity-loader-base";
import { UserQuery } from "@/repository/userquery/user-query";

class UserLoader extends EntityLoaderBase<IUser, UserQueryArgs> {
    private static _instance: UserLoader;

    protected queryClass = UserQuery;

    private constructor() {
        super();
    }

    public static instance(): UserLoader {
        if (!this._instance) {
            this._instance = new UserLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IUser[]> {
        return await User.get(ids);
    }

    protected getEntityId(user: IUser): number {
        return user.ID;
    }
}

declare global {
    /** Global instance of the UserLoader. */
    var userLoader: EntityLoader<IUser, UserQueryArgs>
    /**
     * Retrieves users by their IDs.
     *
     * @param {number[]} ids Array of user IDs.
     * @returns {Promise<IUser[]>} Array of users.
     */
    var getUsers: (ids: number[]) => Promise<IUser[]>

    /**
     * Retrieves a single user by ID.
     *
     * @param {number} id The user ID.
     * @returns {Promise<IUser | undefined>} The user or undefined.
     */
    var getUser: (id: number) => Promise<IUser | undefined>
}

globalThis.userLoader = UserLoader.instance();
globalThis.getUsers = async (ids) => {
    return await userLoader.get(ids);
}
globalThis.getUser = async (id) => {
    return (await userLoader.get([id]))[0];
}

export {};
