import { faker } from '@faker-js/faker';
import { DeleteUserController } from './delete-user';

describe('Delete User Controller', () => {
    class DeleteUserUseCaseStub {
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
        const deleteUserUseCase = new DeleteUserUseCaseStub();
        const sut = new DeleteUserController(deleteUserUseCase);

        return { deleteUserUseCase, sut };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 if user is deleted', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if id is invalid', async () => {
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
        const { sut, deleteUserUseCase } = makeSut();
        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null);

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(404);
    });

    it('should return 500 if DeleteUserUseCase throws', async () => {
        // Arrange
        const { sut, deleteUserUseCase } = makeSut();

        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should call DeleteUserUseCase with correct params', async () => {
        // Arrange
        const { sut, deleteUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute');

        // Act
        await sut.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId);
    });
});
