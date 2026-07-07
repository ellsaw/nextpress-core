#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
    .name('np run')
    .command('dev', 'Run Nextpress in development mode')
    .command('start', 'Run Nextpress in production mode')
    .parse(process.argv);

