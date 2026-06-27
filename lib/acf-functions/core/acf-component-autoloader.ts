import fs from 'fs';
import path from 'path';
import { NextpressComponent } from '../types/components/nextpress-component';

/**
 * Autoloads ACF components dynamically from the templates directory.
 * * **Requirements for it to work:**
 * Each `.tsx` file within the `src/app/_templates/components/` directory MUST export the following:
 * 1. `layout` (Named Export): The configuration for the ACF layout, typically defined using the `defineLayout` function.
 * 2. `default` (Default Export): The React component (JSX/TSX function) that renders the layout.
 *
 * @returns {Promise<NextpressComponent[]>} A promise resolving to an array of mapped layout configurations and their respective components.
 */
export async function acfComponentAutoloader(): Promise<NextpressComponent[]> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates', 'components');
    const files = fs.readdirSync(absolutePath);

    const layouts: NextpressComponent[] = [];

    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;

        const imported = await import(`@/app/_templates/components/${file}`);

        const layout = imported.layout;
        const component = imported.default;
        if (!layout || !component) continue;

        layouts.push({layout, Component: component});
    }

    return layouts;
}
