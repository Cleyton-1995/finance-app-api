import { faker } from '@faker-js/faker';
import { UpdateTransactionsUseCase } from './update-transaction';

describe('UpdateTransactionUseCase', () => {
    const transaction = {
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString().slice(0, 10),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    };

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return { id: transactionId, ...transaction };
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub();

        const sut = new UpdateTransactionsUseCase(updateTransactionRepository);

        return {
            sut,
            updateTransactionRepository,
        };
    };

    it('should create a transaction successfully', async () => {
        // arrange
        const { sut } = makeSut();

        // act
        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        });

        // assert
        expect(result).toEqual(transaction);
    });

    it('should call UpdateTransactionRepository with correct params', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut();
        const updateTransactionRepositorySpy = jest.spyOn(
            updateTransactionRepository,
            'execute',
        );

        // act
        await sut.execute(transaction.id, {
            amount: transaction.amount,
        });

        // assert
        expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
            transaction.id,
            {
                amount: transaction.amount,
            },
        );
    });

    it('should throw if UpdateTransactionRepository throws', async () => {
        // arrange
        const { sut, updateTransactionRepository } = makeSut();
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error());

        // act
        const promise = sut.execute(transaction.id, {
            amount: transaction.amount,
        });

        // assert
        await expect(promise).rejects.toThrow();
    });
});
