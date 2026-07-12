#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

function main() {
    const componentName = process.argv.slice(2).join(' ');;
    if (!componentName) {
        console.error('Please provide a component name.');
        process.exit(1);
    }

    const underscored = componentName.replace(/[- ]/g, '_').toLowerCase();

    const hyphenated = underscored.replaceAll('_', '-');

    const capitalized = underscored.replace(/(^|_)([a-z])/g, (match, p1, p2) => p2.toUpperCase());

    const dir = path.join(process.cwd(), 'next-js/src/app/_templates/components', hyphenated);

    const template =
    `import { defineLayout } from '@nextpress/acf-functions/services/define-layout';
import { FieldProps } from '@nextpress/acf-functions/types/components/field-props';

export const layout = defineLayout({
    name: '${underscored}',
    label: '${componentName}',
    display: 'block',
    sub_fields: [
        {
            name: 'heading',
            label: 'Heading',
            type: 'text',
        },
    ]
});

export default async function ${capitalized}({ heading }: FieldProps<typeof layout>) {
    return (
        <div className='container mx-auto'>
        </div>
    )
}`;

    try {
        const filename = `${hyphenated}.tsx`;

        if (fs.existsSync(path.join(dir, filename))) {
            throw new Error('Component already exists');
        } else {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(path.join(dir, filename), template);

        console.log(`Successfully generated component ${componentName} at ${dir}`);
    } catch (error) {
        console.error('Failed to generate component:', error.message);
    }
}

main();
