import { PostQueryArgs } from "nextpress/repository/postquery/post-query-args";
import { Post } from "../../entities/post/post";
import { IPost } from "../../entities/post/post.interface";
import { EntityLoader } from "./entity-loader";
import { EntityLoaderBase } from "./entity-loader-base";
import { PostQuery } from "nextpress/repository/postquery/post-query";

class PostLoader extends EntityLoaderBase<IPost, PostQueryArgs> {
    private static _instance: PostLoader;

    protected queryClass = PostQuery;

    private constructor() {
        super();
    }

    public static instance(): PostLoader {
        if (!this._instance) {
            this._instance = new PostLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IPost[]> {
        return await Post.get(ids);
    }

    protected getEntityId(post: IPost): number {
        return post.ID;
    }
}

declare global {
    /** Global instance of the PostLoader. */
    var postLoader: EntityLoader<IPost, PostQueryArgs>
    /**
     * Retrieves posts by their IDs.
     *
     * @param {number[]} ids Array of post IDs.
     * @returns {Promise<IPost[]>} Array of posts.
     */
    var getPosts: (ids: number[]) => Promise<IPost[]>
    /**
     * Retrieves a single post by ID.
     *
     * @param {number} id The post ID.
     * @returns {Promise<IPost | undefined>} The post or undefined.
     */
    var getPost: (id: number) => Promise<IPost | undefined>
}

globalThis.postLoader = PostLoader.instance();
globalThis.getPosts = async (ids) => {
    return await postLoader.get(ids);
}
globalThis.getPost = async (id) => {
    return (await postLoader.get([id]))[0];
}

export {};
