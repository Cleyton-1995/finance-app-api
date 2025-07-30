import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';
import { user } from '../../tests';

describe('GetUserByIdUseCase', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdUseCaseStub();
        const sut = new GetUserByIdUseCase(getUserByIdRepository);

        return { getUserByIdRepository, sut };
    };

    it('should get user by id successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(faker.string.uuid());

        //  Assert
        expect(result).toEqual(user);
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid());

        //  Assert
        expect(promise).rejects.toThrow();
    });
});
