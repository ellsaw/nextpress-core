import fs from 'fs';
import path from 'path';
import { NextpressComponent } from '../types/components/nextpress-component';

/**
 * Autoloads ACF components dynamically from nested directories within the templates directory.
 * * **Requirements for it to work:**
 * Each `.tsx` file within `src/app/_templates/components/{any-dir}/` MUST export the following:
 * 1. `layout` (Named Export): The configuration for the ACF layout.
 * 2. `default` (Default Export): The React component that renders the layout.
 *
 * @returns {Promise<NextpressComponent[]>} A promise resolving to an array of mapped layout configurations and their respective components.
 */
export async function acfComponentAutoloader(): Promise<NextpressComponent[]> {
    const basePath = path.join(process.cwd(), 'src', 'app', '_templates', 'components');
    const layouts: NextpressComponent[] = [];

    const items = fs.readdirSync(basePath, { withFileTypes: true });

    for (const item of items) {
        if (!item.isDirectory()) continue;

        const dirName = item.name;
        const dirPath = path.join(basePath, dirName);
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (!file.endsWith('.tsx')) continue;

            const imported = await import(`@/app/_templates/components/${dirName}/${file}`);

            const layout = imported.layout;
            const component = imported.default;

            if (!layout || !component) continue;

            layouts.push({ layout, Component: component });
        }
    }

    return layouts;
}
