import { prisma } from './prisma/prisma';

// Ensure DATABASE_URL is set for tests
process.env.DATABASE_URL = 'postgresql://root:csc@localhost:5433/finance-app';

beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({});
        await tx.user.deleteMany({});
    });
});
