import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma.js';
import { TransactionNotFoundError } from '../../../errors/index.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            const deletedTransaction = await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            });

            return {
                ...deletedTransaction,
                // Normalize to date-only string to avoid timezone shifts in tests/consumers
                date: dayjs(deletedTransaction.date).format('YYYY-MM-DD'),
            };
        } catch (error) {
            // Map Prisma's "record not found for delete" to a domain error
            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                throw new TransactionNotFoundError(transactionId);
            }

            throw error;
        }
    }
}
