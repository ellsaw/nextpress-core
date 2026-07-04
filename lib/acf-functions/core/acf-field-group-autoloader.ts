import fs from 'fs';
import path from 'path';
import { NextpressFieldGroup } from '../types/acf-field-group';

/**
 * Autoloads ACF field groups dynamically from the field-groups directory.
 * * **Requirements for it to work:**
 * Each `.ts` file within the `src/app/_templates/components/field-groups/` directory MUST export the following:
 * 1. `default` (Default Export): The configuration object for the ACF Field Group, typically defined using the `defineFieldGroup` function.
 *
 * @returns {Promise<NextpressFieldGroup[]>} A promise resolving to an array of loaded ACF field group configurations.
 */
export async function acfFieldGroupAutoloader(): Promise<NextpressFieldGroup[]> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates', 'components', 'field-groups');
    const files = fs.readdirSync(absolutePath);

    const fieldGroups: NextpressFieldGroup[] = [];

    for (const file of files) {
        if (!file.endsWith('.ts')) continue;

        const imported = await import(`@/app/_templates/components/field-groups/${file}`);
        const fieldGroup = imported.default;

        fieldGroups.push(fieldGroup);
    }

    return fieldGroups;
}
