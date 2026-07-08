#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
    .name('np run')
    .command('dev', 'Run Nextpress in development mode')
    .command('start', 'Run Nextpress in production mode')
    .command('wp-cli', 'Execute command in the Wordpress CLI')
    .parse(process.argv);

