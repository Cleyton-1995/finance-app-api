import { prisma } from '../../../../prisma/prisma.js';
import { TransactionNotFoundError } from '../../../errors/transaction.js';
import { Prisma } from '@prisma/client';

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

            if (
                Object.prototype.hasOwnProperty.call(
                    updateTransactionsParams,
                    'amount',
                )
            ) {
                data.amount = new Prisma.Decimal(
                    Number(updateTransactionsParams.amount).toFixed(2),
                );
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
