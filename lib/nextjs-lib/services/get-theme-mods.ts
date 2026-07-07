import { unserialize } from "php-serialize";

/**
 * Retrieves a theme modification value by key.
 *
 * @param {string} key - The key of the theme modification to retrieve.
 * @returns {Promise<unknown | undefined>} The theme modification value, or undefined if not found.
 */
export async function getThemeMods(key: string): Promise<unknown | undefined> {
    const themeModOption = await getOption('theme_mods_nextpress_theme');

    const themeMods: Record<string, unknown> | unknown[] = unserialize(themeModOption ?? 'a:0:{}');
    if (Array.isArray(themeMods)) return;

    return themeMods[key];
}
