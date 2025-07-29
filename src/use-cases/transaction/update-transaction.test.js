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
});
