import { Selectable } from "kysely";
import { IFieldLocation, IPath } from "../common";
import { WpPost } from "nextpress/wpdb/wpdb.interface";

/**
 * Attributes for post attachment images.
 */
export type PostImageAttributes = {
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
export type MenuItemAttributes = {
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
export interface IBasePost extends Selectable<WpPost> {}

/**
 * Page post properties.
 */
export interface IPagePost extends IBasePost, IPath {}

/**
 * Standard post properties.
 */
export interface IPostPost extends IBasePost, IPath {
    /** Featured image attachment ID. */
    thumbnailId: number,
}

/**
 * Attachment post properties.
 */
export interface IAttachmentPost extends IBasePost {
    /** Image attributes. */
    imageAttributes: PostImageAttributes,
}

/**
 * Menu item properties.
 */
export interface IMenuItem extends IBasePost {
    /** Menu item attributes. */
    menuItemAttributes: MenuItemAttributes | null
}

/**
 * Comprehensive post entity encompassing all post types.
 */
export interface IPost extends IBasePost, IPagePost, IPostPost, IAttachmentPost, IMenuItem, IFieldLocation {};
