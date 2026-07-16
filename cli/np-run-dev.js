#!/usr/bin/env node

import path from 'path';
import { runCommand } from './run-command.js';
import { startComposer, containerLibPath } from './start-composer.js';

const composeBaseArgs = [
    'compose',
    '--project-directory', process.cwd(),
    '--env-file', path.join(process.cwd(), '.env'),
    '-f', path.join(containerLibPath, 'docker-compose.yml'),
    '-f', path.join(process.cwd(), 'docker-compose.extend.yml'),
    '-f', path.join(containerLibPath, 'docker-compose.dev.yml'),
    '-f', path.join(process.cwd(), 'docker-compose.dev.extend.yml'),
]

async function startDev() {
    await startComposer(composeBaseArgs,
        async () => {
            console.log('Running Nextpress in development mode (This can take a while)');
            const dockerArgs = [
                ...composeBaseArgs,
                'up',
                '--watch',
                '--build',
                '--menu=0',
                'next-js', 'wordpress', 'ready-check',
            ];
            await runCommand('docker', dockerArgs);
        }
    );
}

await startDev();
