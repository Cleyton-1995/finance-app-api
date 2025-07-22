import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
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
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub();
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        );

        return { getTransactionsByUserIdUseCase, sut };
    };

    it('should return 200 when finding transaction by user id successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        });

        //  Assert
        expect(response.statusCode).toBe(200);
    });

    it('should return 400 when missing userId params', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            query: {
                userId: undefined,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 400 when missing userId param is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const response = await sut.execute({
            query: {
                userId: 'invalid_userId',
            },
        });

        //  Assert
        expect(response.statusCode).toBe(400);
    });

    it('should return 404 when GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        // Arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError());

        // Act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
            },
        });

        //  Assert
        expect(response.statusCode).toBe(404);
    });
});
