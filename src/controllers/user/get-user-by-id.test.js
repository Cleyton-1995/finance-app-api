import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';
import { user } from '../../tests';

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user;
        }
    }

    const httpRequest = {
        params: { userId: faker.string.uuid() },
    };

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub();
        const sut = new GetUserByIdController(getUserByIdUseCase);

        return { getUserByIdUseCase, sut };
    };

    it('should return 200 if user is found', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if an invalid id is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 404 if user is not found', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut();
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null);

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if GetUserByIdUseCase throws', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut();

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should call GetUserByIdUseCase with correct params', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut();

        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute');

        // Act
        await sut.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
