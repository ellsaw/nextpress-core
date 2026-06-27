import { Selectable } from "kysely";
import { WpPost } from "../../wpdb/wpdb.interface";
import { IFieldLocation, IPath } from "../common";

/**
 * Attributes for post attachment images.
 */
type PostImageAttributes = {
    /** Image source URL. */
    src?: string,
    /** Image alternative text. */
    alt?: string,
    /** Image height. */
    height?: number,
    /** Image width. */
    width?: number,
}

/**
 * Attributes for nav menu items.
 */
type MenuItemAttributes = {
    /** Menu item label. */
    label: string,
    /** Menu item type. */
    type: 'custom' | 'post_type' | 'taxonomy',
    /** Parent menu item ID. */
    parentId: number,
    /** Target object ID. */
    objectId: number,
    /** Menu item URL. */
    url: string,
}

/**
 * Base post properties.
 */
interface IBasePost extends Selectable<WpPost> {}

/**
 * Page post properties.
 */
interface IPagePost extends IBasePost, IPath {}

/**
 * Standard post properties.
 */
interface IPostPost extends IBasePost, IPath {
    /** Featured image attachment ID. */
    thumbnailId: number,
}

/**
 * Attachment post properties.
 */
interface IAttachmentPost extends IBasePost {
    /** Image attributes. */
    imageAttributes: PostImageAttributes,
}

/**
 * Menu item properties.
 */
interface IMenuItem extends IBasePost {
    /** Menu item attributes. */
    menuItemAttributes: MenuItemAttributes | null
}

/**
 * Comprehensive post entity encompassing all post types.
 */
interface IPost extends IBasePost, IPagePost, IPostPost, IAttachmentPost, IMenuItem, IFieldLocation {};
