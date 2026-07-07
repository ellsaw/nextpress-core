import { spawn } from 'child_process';

export const runCommand = (command, args) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit'
        });

        child.on('exit', (code, signal) => {
            if (code === 0) {
                resolve();
            }
            else if (command === 'docker' && args.includes('down')) {
                resolve();
            }
            else {
                reject(new Error(`Command "${command} ${args.join(' ')}" failed with code ${code} / signal ${signal}`));
            }
        });

        child.on('error', (err) => reject(err));
    });
};
