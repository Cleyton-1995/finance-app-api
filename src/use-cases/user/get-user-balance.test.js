import { faker } from '@faker-js/faker';
import { GetUserBalanceUseCase } from './get-user-balance';
import { UserNotFoundError } from '../../errors/user';
import { user, userBalance } from '../../tests';

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance;
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
        const getUserByIdRepository = new GetUserByIdRepositoryStub();
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        );

        return { getUserBalanceRepository, getUserByIdRepository, sut };
    };

    const from = '2025-10-01';
    const to = '2025-10-31';

    it('should get user balance successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(faker.string.uuid(), from, to);

        //  Assert
        expect(result).toEqual(userBalance);
    });

    it('should throws UserNotFoundError if GetUserBalanceRepository returns null', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        jest.spyOn(getUserByIdRepository, 'execute').mockReturnValue(null);
        const userId = faker.string.uuid();

        // Act
        const promise = sut.execute(userId, from, to);

        //  Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
    });

    it('should call GetUserByIdRepository with correct params', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute');
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId, from, to);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(userId);
    });

    it('should call GetUserBalanceRepository with correct params', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut();
        const executeSpy = jest.spyOn(getUserBalanceRepository, 'execute');
        const userId = faker.string.uuid();

        // Act
        await sut.execute(userId, from, to);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(userId, from, to);
    });

    it('should throw if GetUserByIdRepository throws', async () => {
        // Arrange
        const { sut, getUserByIdRepository } = makeSut();

        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid(), from, to);

        //  Assert
        expect(promise).rejects.toThrow();
    });

    it('should throw if GetUserBalanceRepository throws', async () => {
        // Arrange
        const { sut, getUserBalanceRepository } = makeSut();

        jest.spyOn(getUserBalanceRepository, 'execute').mockRejectedValue(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid(), from, to);

        //  Assert
        expect(promise).rejects.toThrow();
    });
});
