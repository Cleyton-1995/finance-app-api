import { prisma } from '../../../../prisma/prisma.js';
import { TransactionNotFoundError } from '../../../errors/transaction.js';

export class PostgresUpdateTransactionsRepository {
    async execute(transactionId, updateTransactionsParams) {
        try {
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
        } catch (error) {
            // Map Prisma's "record not found for update" to a domain error
            if (error && error.code === 'P2025') {
                throw new TransactionNotFoundError(transactionId);
            }

            throw error;
        }
    }
}
