import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
            return faker.number.int();
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
        const sut = new GetUserBalanceController(getUserBalanceUseCase);

        return { getUserBalanceUseCase, sut };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        query: {
            from: '2024-01-01',
            to: '2024-01-31',
        },
    };

    it('should return 200 when getting user balance', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if userId is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            query: {
                from: '2024-01-01',
                to: '2024-01-31',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        // Arrange
        const { sut, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should call GetUserBalanceUseCase with correct params', async () => {
        // Arrange
        const { sut, getUserBalanceUseCase } = makeSut();

        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute');

        // Act
        await sut.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.query.from,
            httpRequest.query.to,
        );
    });

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        // Arrange
        const { sut, getUserBalanceUseCase } = makeSut();

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        );

        // Act
        const response = await sut.execute(httpRequest);

        //  Assert
        expect(response.statusCode).toBe(404);
    });
});
