#!/usr/bin/env node
import { Command } from 'commander';
import path from 'path';
import { runCommand } from './run-command.js';
import { containerLibPath } from './start-composer.js';

const program = new Command();

program
    .name('np run wp-cli')
    .allowUnknownOption()
    .argument('[args...]', 'Arguments passed directly to WP-CLI')
    .action(async () => {
        const wpArgs = program.args;

        await runCommand('docker', [
            'compose',
            '--project-directory', process.cwd(),
            '--env-file', path.join(process.cwd(), '.env'),
            '-f', path.join(containerLibPath, 'docker-compose.yml'),
            'run',
            '--rm',
            'wp-cli',
            'wp',
            ...wpArgs
        ]);
    });

program.parse(process.argv);
