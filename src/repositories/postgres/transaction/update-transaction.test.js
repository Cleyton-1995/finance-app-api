import { faker } from '@faker-js/faker';
import { prisma } from '../../../../prisma/prisma';
import { transaction, user } from '../../../tests';
import { PostgresUpdateTransactionsRepository } from './update-transaction';
import { TransactionType } from '@prisma/client';
import dayjs from 'dayjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TransactionNotFoundError } from '../../../errors';

describe('PostgresUpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        });

        const sut = new PostgresUpdateTransactionsRepository();

        const params = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: Number(faker.finance.amount()),
        };

        const result = await sut.execute(transaction.id, params);

        expect(result.name).toBe(params.name);
        expect(result.type).toBe(params.type);
        expect(result.user_id).toBe(user.id);
        expect(Number(result.amount.toFixed(2))).toBe(
            Number(params.amount.toFixed(2)),
        );

        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(params.date).daysInMonth(),
        );
        expect(dayjs(result.date).month()).toBe(dayjs(params.date).month());
        expect(dayjs(result.date).year()).toBe(dayjs(params.date).year());
    });

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user });
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
                date: new Date(transaction.date),
            },
        });

        const sut = new PostgresUpdateTransactionsRepository();
        const prismaSpy = jest.spyOn(prisma.transaction, 'update');

        const updateData = {
            ...transaction,
            user_id: user.id,
            date: new Date(transaction.date),
        };

        await sut.execute(transaction.id, updateData);

        const [[calledArg]] = prismaSpy.mock.calls;
        expect(calledArg.where.id).toBe(transaction.id);
        expect(calledArg.data.id).toBe(updateData.id);
        expect(calledArg.data.user_id).toBe(updateData.user_id);
        expect(calledArg.data.name).toBe(updateData.name);
        expect(calledArg.data.type).toBe(updateData.type);
        expect(calledArg.data.date).toEqual(updateData.date);
        expect(String(calledArg.data.amount)).toBe(
            Number(updateData.amount).toFixed(2),
        );
    });

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionsRepository();
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new Error(),
        );

        const promise = sut.execute(transaction.id, transaction);

        await expect(promise).rejects.toThrow();
    });

    it('should throw TransactionNotFoundError if Prisma returns known not-found error', async () => {
        const sut = new PostgresUpdateTransactionsRepository();
        jest.spyOn(prisma.transaction, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        );

        const promise = sut.execute(transaction.id, transaction);

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        );
    });
});
