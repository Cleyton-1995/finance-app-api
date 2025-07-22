import { faker } from '@faker-js/faker';
import { DeleteTransactionController } from './delete-transaction';

describe('DeleteTransactionController', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString().slice(0, 10),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            };
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub();
        const sut = new DeleteTransactionController(deleteTransactionUseCase);

        return { deleteTransactionUseCase, sut };
    };

    it('should return 200 when deleting transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        });

        //  Assert
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when id is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 404 when transaction is not found', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        );

        // Act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        });

        //  Assert
        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if DeleteTransactionUseCase throws', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut();

        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        });

        //  Assert
        expect(result.statusCode).toBe(500);
    });
});
