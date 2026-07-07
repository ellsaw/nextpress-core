import path from 'path';
import { __dirname } from './meta.js';
import { runCommand } from './run-command.js';

export const containerLibPath = path.join(__dirname, '..', 'lib', 'container-lib');

export async function startComposer(composerArgs, callback) {
    let isCleaningUp = false;

    const cleanup = async () => {
        if (isCleaningUp) return;
        isCleaningUp = true;

        console.log('\nStopping Nextpress services...');
        try {
            await runCommand('docker', [...composerArgs, 'down']);
            console.log('Nextpress services stopped successfully.');
        } catch (err) {
            console.error(`Error during cleanup: ${err.message}`);
        }
        process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    try {
        console.log('Installing Next.js dependencies...');
        await runCommand('npm', ['install', '--prefix', path.join(process.cwd(), 'next-js'), '--silent']);

        console.log('Installing/Validating Nextpress...');
        await runCommand('npx', ['np', 'install']);

        await callback();
    } catch (error) {
        console.error(`Setup stopped: ${error.message}`);
        await cleanup();
    }
}
