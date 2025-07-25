import { faker } from '@faker-js/faker';
import { UpdateTransactionsController } from './update-transaction';

describe('UpdateTransactionController', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    date: faker.date.anytime().toISOString().slice(0, 10),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ];
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub();
        const sut = new UpdateTransactionsController(updateTransactionUseCase);

        return { updateTransactionUseCase, sut };
    };

    const baseHttpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString().slice(0, 10),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    };

    it('should return 200 when updating a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute(baseHttpRequest);

        //  Assert
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when transaction id is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            params: { transactionId: 'invalid_id' },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when unallowed field is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                unallowed_field: 'some_value',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when amount is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when type is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        // Arrange
        const { sut, updateTransactionUseCase } = makeSut();
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const response = await sut.execute(baseHttpRequest);

        //  Assert
        expect(response.statusCode).toBe(500);
    });

    it('should call UpdateTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, updateTransactionUseCase } = makeSut();
        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute');

        // Act
        await sut.execute(baseHttpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        );
    });
});
