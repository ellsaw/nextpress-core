import { unserialize } from "php-serialize";
import { Fields } from "../common";
import { IPost, PostImageAttributes, MenuItemAttributes } from "./post.interface";
import { processURL } from "@nextpress/services/utilities/process-url";
import { wpdb } from "@nextpress/wpdb/wpdb";

const excerptLength = nextpressConfig.excerptLength ?? 55;

/**
 * Implementation of IPost entity.
 */
export class Post implements IPost {
    constructor(public ID: number) { }

    /** Raw post data from database. */
    private postData?: Record<string, any>;
    /** Map of post meta key-value pairs. */
    private metaMap?: Map<string, string>;

    /**
     * Retrieves array of Post instances by IDs.
     *
     * @param {number[]} ids - Array of post IDs to retrieve.
     * @returns {Promise<Post[]>} Promise resolving to array of Post instances.
     */
    static async get(ids: number[]): Promise<Post[]> {
        ids = ids.filter(Boolean);
        if (!ids || !ids.length) return [];

        const postsData = await wpdb
            .selectFrom('wpPosts')
            .where('ID', 'in', ids)
            .selectAll()
            .execute();

        const metaData = await wpdb
            .selectFrom('wpPostmeta')
            .where('postId', 'in', ids)
            .where('metaKey', 'in', [
                '_nextpress_path',
                '_thumbnail_id',
                '_wp_attachment_image_alt',
                '_wp_attachment_metadata',
                '_menu_item_type',
                '_menu_item_object_id',
                '_menu_item_url',
                '_menu_item_menu_item_parent'
            ])
            .select(['postId', 'metaKey', 'metaValue'])
            .execute();

        const metaByPostId = new Map<number, Map<string, string>>();
        for (const row of metaData) {
            const postId = Number(row.postId);
            if (!metaByPostId.has(postId)) {
                metaByPostId.set(postId, new Map());
            }
            metaByPostId.get(postId)?.set(row.metaKey || '', row.metaValue || '');
        }

        const postDataMap = new Map(postsData.map(post => [Number(post.ID), post]));

        return ids.map(id => {
            const instance = new Post(id);

            instance.postData = postDataMap.get(id);
            instance.metaMap = metaByPostId.get(id) || new Map<string, string>();

            postLoader.prime([instance.thumbnailId]);

            return instance;
        });
    }

    get path(): string {
        return this.metaMap?.get('_nextpress_path') ?? '';
    }

    get thumbnailId(): number {
        const val = this.metaMap?.get('_thumbnail_id');
        return val ? Number(val) : 0;
    }

    private _imageAttributes?: PostImageAttributes;
    get imageAttributes(): PostImageAttributes {
        if (this._imageAttributes !== undefined) return this._imageAttributes;
        if (!this.metaMap) return {};

        const alt = this.metaMap.get('_wp_attachment_image_alt') ?? '';
        const rawMetadata = this.metaMap.get('_wp_attachment_metadata');

        if (!rawMetadata && !alt) {
            this._imageAttributes = {};
            return this._imageAttributes;
        }

        const guid = this.guid;
        const index = guid.indexOf('/wp-content');
        const path = index !== -1 ? guid.slice(index) : guid;
        const srcPath = `${process.env.WP_SERVICE_URL}${path}`;

        try {
            const metadata: { height?: string; width?: string } = unserialize(rawMetadata ?? 'a:0:{}');
            this._imageAttributes = {
                src: srcPath,
                alt: alt,
                height: metadata.height ? Number(metadata.height) : undefined,
                width: metadata.width ? Number(metadata.width) : undefined
            };
        } catch (error: any) {
            console.warn('Error while getting post: Could not unserialize php: ', error.message);
            this._imageAttributes = {};
        }

        return this._imageAttributes;
    }

    private _menuItemAttributes?: MenuItemAttributes | null
    get menuItemAttributes(): MenuItemAttributes | null {
        if (this._menuItemAttributes !== undefined) return this._menuItemAttributes;
        if (!this.metaMap) return null;

        const typeMeta = this.metaMap.get('_menu_item_type');
        const type = ['custom', 'post_type', 'taxonomy'].includes(typeMeta ?? '')
            ? typeMeta as 'custom' | 'post_type' | 'taxonomy'
            : undefined;

        let url;
        let objectId;
        if (type === 'custom') {
            const urlMeta = this.metaMap.get('_menu_item_url');
            url = urlMeta ? processURL(urlMeta) : '';
        } else {
            objectId = Number(this.metaMap.get('_menu_item_object_id'));
        }

        const parentId = Number(this.metaMap.get('_menu_item_menu_item_parent')) ?? 0;

        const label = this.postTitle ?? '';

        return {
            label,
            type: type ?? 'custom',
            parentId,
            objectId: objectId ?? 0,
            url: url ?? ''
        }
    }

    private _postExcerpt?: string
    get postExcerpt(): string {
        if (this._postExcerpt !== undefined) return this._postExcerpt;
        const excerpt = this.postData?.['postExcerpt'] ?? '';

        if (excerpt) return excerpt;

        const postContent = this.postContent;
        if (!postContent) return '';

        const plainText = postContent
            .replace(/<[^>]+>/g, ' ') // Strip HTML tags
            .replace(/\s+/g, ' ')     // Normalize multiple spaces into a single space
            .trim();

        const words = plainText.split(' ');
        if (words.length > (excerptLength)) {
            return words.slice(0, excerptLength).join(' ') + '...';
        }

        this._postExcerpt = plainText;
        return this._postExcerpt;
    }

    get commentCount(): number { return this.postData?.['commentCount'] ?? 0; }
    get commentStatus(): string { return this.postData?.['commentStatus'] ?? 'closed'; }
    get guid(): string { return this.postData?.['guid'] ?? ''; }
    get menuOrder(): number { return this.postData?.['menuOrder'] ?? 0; }
    get pinged(): string { return this.postData?.['pinged'] ?? ''; }
    get pingStatus(): string { return this.postData?.['pingStatus'] ?? 'closed'; }
    get postAuthor(): number { return this.postData?.['postAuthor'] ?? 0; }
    get postContent(): string { return this.postData?.['postContent'] ?? ''; }
    get postContentFiltered(): string { return this.postData?.['postContentFiltered'] ?? ''; }
    get postDate(): Date { return this.postData?.['postDate'] ?? new Date(); }
    get postDateGmt(): Date { return this.postData?.['postDateGmt'] ?? new Date(); }
    get postMimeType(): string { return this.postData?.['postMimeType'] ?? ''; }
    get postModified(): Date { return this.postData?.['postModified'] ?? new Date(); }
    get postModifiedGmt(): Date { return this.postData?.['postModifiedGmt'] ?? new Date(); }
    get postName(): string { return this.postData?.['postName'] ?? ''; }
    get postParent(): number { return this.postData?.['postParent'] ?? 0; }
    get postPassword(): string { return this.postData?.['postPassword'] ?? ''; }
    get postStatus(): string { return this.postData?.['postStatus'] ?? 'draft'; }
    get postTitle(): string { return this.postData?.['postTitle'] ?? ''; }
    get postType(): string { return this.postData?.['postType'] ?? 'post'; }
    get toPing(): string { return this.postData?.['toPing'] ?? ''; }

    async getFields(name: string): Promise<Fields> {
        const meta = await wpdb
            .selectFrom('wpPostmeta')
            .where('metaKey', 'like', `${name}%`)
            .where('postId', '=', this.ID)
            .select(['metaKey', 'metaValue'])
            .execute();

        return meta.map(m => ({
            key: m.metaKey || '',
            value: m.metaValue || ''
        }));
    }
}
