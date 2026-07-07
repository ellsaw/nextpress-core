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
    '-f', path.join(containerLibPath, 'docker-compose.prod.yml'),
    '-f', path.join(process.cwd(), 'docker-compose.prod.extend.yml'),
]

async function start() {
    await startComposer(composeBaseArgs,
        async () => {
            console.log('Running Nextpress in production mode');
            const dockerArgs = [
                ...composeBaseArgs,
                'up',
                '--build',
                '--detach',
            ];
            await runCommand('docker', dockerArgs);
            console.log('\nNextpress services detached and running in background. Run npx np log to stream logs or npx np down to terminate the process');
        }
    );
}

await start();
