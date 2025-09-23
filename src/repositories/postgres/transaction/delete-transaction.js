import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma.js';
import { TransactionNotFoundError } from '../../../errors/index.js';

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
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === undefined) {
                    throw new TransactionNotFoundError(transactionId);
                }
            }

            throw error;
        }
    }
}
