import { IPost } from "../../entities/post/post.interface";
import { ITerm } from "../../entities/term/term.interface";
import { IUser } from "../../entities/user/user.interface";
import { queriedObjectState } from "../globals";

/**
 * Represents the state of the queried object.
 */
interface IQueriedObject {
    /** Type of the queried object. */
    objectType: 'post' | 'term' | 'user' | null,
    /** Array of post IDs associated with the query. */
    posts: number[],
    /** Current page number. */
    page: number,
    /** Total page count. */
    pageCount: number,
    /** ID of the main queried term. */
    mainTerm?: number,
    /** Array of term IDs associated with the query. */
    terms: number[],
    /** ID of the queried user. */
    user?: number,
}

/**
 * Creates a blank queried object state.
 *
 * @returns {IQueriedObject} Blank state object.
 */
const createBlankState = (): IQueriedObject => ({
    objectType: null,
    posts: [],
    page: 1,
    pageCount: 1,
    terms: [],
});

declare global {
    /** The current queried object. */
    var queriedObject: IQueriedObject
    /**
     * Retrieves the first post from the queried object.
     * @returns {Promise<IPost | undefined>} The post.
     */
    var getThePost: () => Promise<IPost | undefined>
    /**
     * Retrieves all posts from the queried object.
     * @returns {Promise<IPost[]>} Array of posts.
     */
    var getThePosts: () => Promise<IPost[]>
    /**
     * Retrieves the current page number.
     * @returns {number} Page number.
     */
    var getThePage: () => number
    /**
     * Retrieves the total page count.
     * @returns {number} Page count.
     */
    var getThePageCount: () => number
    /**
     * Retrieves the main term from the queried object.
     * @returns {Promise<ITerm | undefined>} The term.
     */
    var getTheTerm: () => Promise<ITerm | undefined>
    /**
     * Retrieves all terms from the queried object.
     * @returns {Promise<ITerm[]>} Array of terms.
     */
    var getTheTerms: () => Promise<ITerm[]>
    /**
     * Retrieves the user from the queried object.
     * @returns {Promise<IUser | undefined>} The user.
     */
    var getTheUser: () => Promise<IUser | undefined>
}

Object.defineProperty(globalThis, 'queriedObject', {
    configurable: true,
    enumerable: true,
    get() {
        const state = queriedObjectState();
        return state.currentState || createBlankState();
    },
    set(newData: IQueriedObject) {
        const store = queriedObjectState();

        if (newData.posts) postLoader.prime(newData.posts);
        if (newData.mainTerm) termLoader.prime([newData.mainTerm]);
        if (newData.terms) termLoader.prime(newData.terms);
        if (newData.user) userLoader.prime([newData.user]);

        if (!store.currentState) store.currentState = {};
        Object.assign(store.currentState, newData);
    }
});

globalThis.getThePost = async () => {
    return (await postLoader.get(globalThis.queriedObject.posts))[0];
};
globalThis.getThePosts = () => {
    return postLoader.get(globalThis.queriedObject.posts);
};

globalThis.getThePage = () => globalThis.queriedObject.page;

globalThis.getThePageCount = () => globalThis.queriedObject.pageCount;

globalThis.getTheTerm = async () => {
    if (!globalThis.queriedObject.mainTerm) return;
    return (await termLoader.get([globalThis.queriedObject.mainTerm]))[0];
};

globalThis.getTheTerms = () => {
    return termLoader.get(globalThis.queriedObject.terms);
};

globalThis.getTheUser = async () => {
    if (!globalThis.queriedObject.user) return;
    return (await userLoader.get([globalThis.queriedObject.user]))[0];
};

export {};
