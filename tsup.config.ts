import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['lib/**/*.ts', '!lib/**/*.d.ts'],
    format: ['esm'],
    target: 'es2022', 
    experimentalDts: true,
    splitting: false, 
    clean: true,
    bundle: false,
});