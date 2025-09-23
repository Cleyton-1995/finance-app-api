import { prisma } from './prisma/prisma';

beforeEach(async () => {
    await prisma.$transaction(async (tx) => {
        await tx.transaction.deleteMany({});
        await tx.user.deleteMany({});
    });
});
