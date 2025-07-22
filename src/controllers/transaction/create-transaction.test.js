import { faker } from '@faker-js/faker';
import { CreateTransactionController } from './create-transaction';

describe('CreateTransactionController', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction;
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub();
        const sut = new CreateTransactionController(createTransactionUseCase);

        return { createTransactionUseCase, sut };
    };

    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString().slice(0, 10),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    };

    it('should return 201 when creating transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(baseHttpRequest);

        //  Assert
        expect(response.statusCode).toBe(201);
    });

    it('should return 400 when missing user id', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                user_id: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing name', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });
});
