import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user';
import { user } from '../../tests';

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub();

        const sut = new DeleteUserUseCase(deleteUserRepository);

        return {
            deleteUserRepository,
            sut,
        };
    };

    it('should successfully delete a user', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const deleteUser = await sut.execute(faker.string.uuid());

        //  Assert
        expect(deleteUser).toEqual(user);
    });

    it('should call DeleteUserRepository with correct params', async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut();
        const executeSpy = jest.spyOn(deleteUserRepository, 'execute');
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if DeleteUserRepository throws', async () => {
        // Arrange
        const { sut, deleteUserRepository } = makeSut();

        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid());

        //  Assert
        expect(promise).rejects.toThrow();
    });
});
