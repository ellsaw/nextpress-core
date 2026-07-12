#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
    .name('np gen')
    .command('component', 'Create component from template')
    .parse(process.argv);
