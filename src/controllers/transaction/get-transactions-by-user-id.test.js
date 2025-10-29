import { faker } from '@faker-js/faker';
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id';
import { UserNotFoundError } from '../../errors/user';
import { transaction } from '../../tests';

describe('GetTransactionsByUserIdController', () => {
    const from = '2025-10-01';
    const to = '2025-10-31';

    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction];
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
                from,
                to,
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
                from,
                to,
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
                from,
                to,
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
                from,
                to,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(404);
    });

    it('should return 500 when GetTransactionsByUserIdUseCase throws generic error', async () => {
        // Arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error());

        // Act
        const response = await sut.execute({
            query: {
                userId: faker.string.uuid(),
                from,
                to,
            },
        });

        //  Assert
        expect(response.statusCode).toBe(500);
    });

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        // Arrange
        const { sut, getTransactionsByUserIdUseCase } = makeSut();
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        );

        const userId = faker.string.uuid();

        // Act
        await sut.execute({
            query: {
                userId: userId,
                from,
                to,
            },
        });

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });
});
