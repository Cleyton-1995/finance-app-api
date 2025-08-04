import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { user, transaction } from '../../../tests';
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id';

describe('PostgresGetTransactionsByUserIdRepository', () => {
    const from = '2024-01-01';
    const to = '2024-01-31';

    it('should get transactions by user id on db', async () => {
        const date = '2024-01-02';
        const sut = new PostgresGetTransactionsByUserIdRepository();
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: { ...transaction, date: new Date(date), user_id: user.id },
        });

        const result = await sut.execute(user.id, from, to);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe(transaction.name);
        expect(result[0].type).toBe(transaction.type);
        expect(result[0].user_id).toBe(user.id);
        expect(Number(result[0].amount).toFixed(2)).toBe(
            Number(transaction.amount).toFixed(2),
        );

        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(date).daysInMonth(),
        );
        expect(dayjs(result[0].date).month()).toBe(dayjs(date).month());
        expect(dayjs(result[0].date).year()).toBe(dayjs(date).year());
    });

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetTransactionsByUserIdRepository();
        const prismaSpy = jest.spyOn(prisma.transaction, 'findMany');

        await sut.execute(user.id);

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
            },
        });
    });
});
