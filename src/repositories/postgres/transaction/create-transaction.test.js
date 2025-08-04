import dayjs from 'dayjs';
import { prisma } from '../../../../prisma/prisma';
import { PostgresCreateTransactionRepository } from './create-transaction';
import { transaction, user } from '../../../tests';
describe('PostgresCreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        await prisma.user.create({ data: user });
        const sut = new PostgresCreateTransactionRepository();

        const result = await sut.execute({ ...transaction, user_id: user.id });

        expect(result.name).toBe(transaction.name);
        expect(result.type).toBe(transaction.type);
        expect(result.user_id).toBe(user.id);
        expect(Number(result.amount.toFixed(2))).toBe(
            Number(transaction.amount.toFixed(2)),
        );

        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(
            dayjs(transaction.date).month(),
        );
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year());
    });
});
