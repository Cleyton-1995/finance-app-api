import { prisma } from '../../../../prisma/prisma.js';

export class PostgresUpdateTransactionsRepository {
    async execute(transactionId, updateTransactionsParams) {
        const data = { ...updateTransactionsParams };

        if (
            Object.prototype.hasOwnProperty.call(
                updateTransactionsParams,
                'date',
            )
        ) {
            data.date = new Date(updateTransactionsParams.date);
        }

        return await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data,
        });
    }
}
