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

    it('should return 201 when creating transaction successfully (expense)', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EXPENSE',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(201);
    });

    it('should return 201 when creating transaction successfully (earning)', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(201);
    });

    it('should return 201 when creating transaction successfully (investment)', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
            },
        });

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

    it('should return 400 when missing date', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing type', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing amount', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when date is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when amount is not a valid currency', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 500 if CreateTransactionUseCase throws', async () => {
        // Arrange
        const { sut, createTransactionUseCase } = makeSut();

        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(baseHttpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should call CreateTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, createTransactionUseCase } = makeSut();

        const executeSpy = jest.spyOn(createTransactionUseCase, 'execute');

        // Act
        await sut.execute(baseHttpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body);
    });
});
