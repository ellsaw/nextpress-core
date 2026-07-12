#!/usr/bin/env node

import path from 'path';
import { runCommand } from './run-command.js';
import { containerLibPath } from './start-composer.js';

await runCommand('docker', [
    'compose',
    '--project-directory', process.cwd(),
    '-f', path.join(containerLibPath, 'docker-compose.yml'),
    'down'
]);
