#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
    .name('np')
    .command('install', 'Install Nextpress')
    .command('run', 'Run Nextpress')
    .command('down', 'Terminate Nextpress')
    .command('log', 'Log Nextpress in production')
    .parse(process.argv);
