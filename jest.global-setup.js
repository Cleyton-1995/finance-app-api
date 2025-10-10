import { execSync } from 'child_process';

async function init() {
    execSync('docker compose up -d --wait postgres-test');

    // // Set DATABASE_URL for the test environment
    // process.env.DATABASE_URL =
    //     'postgresql://root:csc@localhost:5433/finance-app';

    execSync('npx prisma db push');
}

export default init;
