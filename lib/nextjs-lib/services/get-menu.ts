import { IMenuItem } from "../entities/post/post.interface";
import { getThemeMods } from "./get-theme-mods";

export type NextpressMenu = {
    item: IMenuItem,
    children: NextpressMenu[]
}

/**
 * Retrieves a menu by its location identifier.
 *
 * @param {string} menuLocation - The location identifier of the menu.
 * @returns {Promise<NextpressMenu[] | undefined>} An array of menu items representing the menu tree, or undefined if the menu is not found.
 */
export async function getMenu(menuLocation: string): Promise<NextpressMenu[] | undefined> {
    const navMenuLocations = await getThemeMods('nav_menu_locations');
    if (!navMenuLocations || typeof navMenuLocations !== 'object') return;

    const menuTermId = Number((navMenuLocations as Record<string, any>)[menuLocation]) || undefined;
    if (!menuTermId) return;

    const postQuery = await postLoader.findAndPrime({
        termId: menuTermId,
        postStatus: 'publish',
        postType: 'nav_menu_item',
        noFoundRows: true,
        noPaging: true
    })

    const menuItems: IMenuItem[] = (await getPosts(postQuery.ids)).sort((a, b) => a.menuOrder - b.menuOrder);

    // Prime cache to get paths in bunch later
    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        if (item.menuItemAttributes.type === 'post_type') {
            postLoader.prime([item.menuItemAttributes.objectId])
        } else if (item.menuItemAttributes.type === 'taxonomy') {
            termLoader.prime([item.menuItemAttributes.objectId])
        }
    }

    const map = new Map<number, NextpressMenu>();
    const tree: NextpressMenu[] = [];

    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        const menuItemAttributes = { ...item.menuItemAttributes };

        if (item.menuItemAttributes.type === 'post_type') {
            const post = await getPost(menuItemAttributes.objectId);

            menuItemAttributes.url = post?.path ?? '';

            if (!menuItemAttributes.label) {
                menuItemAttributes.label = post?.postTitle ?? '';
            }
        } else if (item.menuItemAttributes.type === 'taxonomy') {
            const term = await getTerm(menuItemAttributes.objectId);

            menuItemAttributes.url = term?.path ?? '';

            if (!menuItemAttributes.label) {
                menuItemAttributes.label = term?.name ?? '';
            }
        }

        const safeItem: IMenuItem = {
            ...item,
            menuItemAttributes
        };

        const node: NextpressMenu = {
            item: safeItem,
            children: []
        };

        map.set(item.ID, node);
    }

    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        const currentNode = map.get(item.ID);
        if (!currentNode) continue;

        const parentId = item.menuItemAttributes.parentId;

        if (parentId === 0) {
            tree.push(currentNode);
            continue;
        }

        const parentNode = map.get(parentId);

        if (parentNode) {
            parentNode.children.push(currentNode);
            map.set(parentNode.item.ID, parentNode);
        }
    }

    return tree;
}
