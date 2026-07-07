import fs from 'fs';
import { Metadata } from 'next';
import path from 'path';

/**
 * Loads a specified export suffix from a given template file.
 *
 * @param {string} template - The base name of the template to load.
 * @param {'Metadata' | 'Template'} exportSuffix - The suffix of the export to retrieve from the file.
 * @returns {Promise<any | undefined>} The requested export, or undefined if not found or an error occurs.
 */
async function loadFile(template: string, exportSuffix: 'Metadata' | 'Template'): Promise<any | undefined> {
    const absolutePath = path.join(process.cwd(), 'src', 'app', '_templates');
    const files = fs.readdirSync(absolutePath);

    const imports: any[] = [];

    for (const file of files) {
        if (file !== (`${template.toLowerCase()}.tsx`)) continue;

        try {
            const imported = await import(`@/app/_templates/${file}`);

            const exported = imported[`${template}${exportSuffix}`];

            imports.push(exported);
        } catch (_error) {
            return undefined;
        }
    }

    return imports[0];
}

/**
 * Loads the exported metadata configuration for a given template.
 *
 * @param {string} template - The name of the template file to load metadata from.
 * @returns {Promise<Metadata | undefined>} The metadata object, or undefined if the metadata does not exist.
 */
export async function loadMetadata(template: string): Promise<Metadata | undefined> {
    const metadataFn = await loadFile(template, 'Metadata');
    if (metadataFn) {
        return typeof metadataFn === 'function' ? metadataFn() : metadataFn;
    }
}

export async function loadTemplate(template: string): Promise<React.ComponentType<any> | undefined> {
    const element = await loadFile(template, 'Template');
    if (element) {
        return element as React.ComponentType<any>;
    }
}

