#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'lib');
const destDir = path.join(process.cwd(), '.nextpress');

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
