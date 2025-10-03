import { prisma } from '../../../../prisma/prisma.js';
import { Prisma } from '@prisma/client';

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        return await prisma.transaction.create({
            data: {
                ...createTransactionParams,
                amount: new Prisma.Decimal(
                    Number(createTransactionParams.amount).toFixed(2),
                ),
                date: new Date(createTransactionParams.date),
            },
        });
    }
}
