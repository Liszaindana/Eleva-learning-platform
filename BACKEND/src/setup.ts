#!/usr/bin/env node

/**
 * ELEVA Backend Setup Script
 * 
 * Menjalankan semua setup yang diperlukan untuk membuat aplikasi SPK (Sistem Pendukung Keputusan) bekerja.
 * Ini termasuk:
 * 1. Running Prisma migrations
 * 2. Seeding kriteria dan kriteria_value
 * 3. Creating admin user
 * 4. Seeding test data
 */

// logging

import { spawn } from 'child_process';

const commands = [
    {
        name: '📊 Prisma Migrations',
        cmd: 'npx',
        args: ['prisma', 'migrate', 'deploy']
    },
    {
        name: '🔐 Creating Admin User',
        cmd: 'npx',
        args: ['tsx', 'src/create-admin.ts']
    },
    {
        name: '📚 Seeding Kriteria Data',
        cmd: 'npx',
        args: ['tsx', 'src/create-kriteria.ts']
    },
    {
        name: '🌱 Seeding Test Data',
        cmd: 'npx',
        args: ['tsx', 'src/seed-test-data.ts']
    }
];

async function runCommand(name: string, cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(`\n${name}...`);
        const proc = spawn(cmd, args, { stdio: 'inherit' });

        proc.on('close', (code) => {
            if (code === 0) {
                console.log(`✓ ${name} completed\n`);
                resolve();
            } else {
                reject(new Error(`${name} failed with code ${code}`));
            }
        });

        proc.on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    console.log('🚀 Starting ELEVA Backend Setup...\n');

    try {
        for (const cmd of commands) {
            await runCommand(cmd.name, cmd.cmd, cmd.args);
        }

        console.log('✅ Setup completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm run dev');
        console.log('2. Login with admin@eleva.com / admin123');
        console.log('3. Create recommendation endpoint is ready at POST /recommendation');
    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main();
