import { prisma } from '../../../../prisma/prisma.js';

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId, from, to) {
        const where = {
            user_id: userId,
        };

        if (from && to) {
            // Set end date to end of day in UTC to include the full day
            const toDate = new Date(to);
            const endDate = new Date(
                Date.UTC(
                    toDate.getUTCFullYear(),
                    toDate.getUTCMonth(),
                    toDate.getUTCDate(),
                    23,
                    59,
                    59,
                    999,
                ),
            );

            where.date = {
                gte: new Date(from),
                lte: endDate,
            };
        }

        return await prisma.transaction.findMany({
            where,
        });
    }
}
