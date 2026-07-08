#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { __dirname } from './meta.js';

function write(sourceDir, destDir) {
    try {
        if (!fs.existsSync(sourceDir)) {
            console.error(`Error: Source folder does not exist at ${sourceDir}`);
            process.exit(1);
        }

        if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true, force: true });
        }

        fs.cpSync(sourceDir, destDir, { recursive: true });
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

// Copy nextjs library
write(
    path.join(__dirname, '..', 'lib', 'nextjs-lib'),
    path.join(process.cwd(), 'next-js', '.nextpress')
)

// Copy wordpress library
write(
    path.join(__dirname, '..', 'lib', 'wp-lib', 'src'),
    path.join(process.cwd(), 'wp', 'wp-content', 'themes', 'nextpress_theme', '.nextpress')
)

console.log('Nextpress installation successful.');
