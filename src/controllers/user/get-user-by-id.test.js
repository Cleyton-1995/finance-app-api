import { faker } from '@faker-js/faker';
import { GetUserByIdController } from './get-user-by-id';

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 6,
                }),
            };
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub();
        const sut = new GetUserByIdController(getUserByIdUseCase);

        return { getUserByIdUseCase, sut };
    };

    it('should return 200 if user is found', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        });

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
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        });

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
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        });

        //  Assert
        expect(result.statusCode).toBe(500);
    });
});
