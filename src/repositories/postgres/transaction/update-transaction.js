import { prisma } from '../../../../prisma/prisma.js';

export class PostgresUpdateTransactionsRepository {
    async execute(transactionId, updateTransactionsParams) {
        return await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: {
                ...updateTransactionsParams,
                date: new Date(updateTransactionsParams.date),
            },
        });
    }
}
