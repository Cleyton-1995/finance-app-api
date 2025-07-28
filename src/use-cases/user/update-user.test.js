import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';
import { EmailAlreadyIsUserError } from '../../errors/user';

describe('UpdateUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 6,
        }),
    };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const updateUserRepository = new UpdateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();

        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        );

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        };
    };

    it('should update a user successfully (without email and password)', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(faker.string.uuid(), {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        });

        //  Assert
        expect(result).toBe(user);
    });

    it('should update successfully (without email)', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        const getUserByEmailRepositorySpy = jest.spyOn(
            getUserByEmailRepository,
            'execute',
        );
        const email = faker.internet.email();

        // Act
        const result = await sut.execute(faker.string.uuid(), {
            email,
        });

        //  Assert
        expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
        expect(result).toBe(user);
    });

    it('should update successfully (without password)', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();
        const passwordHasherAdapterSpy = jest.spyOn(
            passwordHasherAdapter,
            'execute',
        );
        const password = faker.internet.password();

        // Act
        const result = await sut.execute(faker.string.uuid(), {
            password,
        });

        //  Assert
        expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
        expect(result).toBe(user);
    });

    it('should  throw if EmailAlreadyIsUserError if email is already in use', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user);

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            email: user.email,
        });

        //  Assert

        await expect(promise).rejects.toThrow(
            new EmailAlreadyIsUserError(user.email),
        );
    });

    it('should call UpdateUserRepository with correct params', async () => {
        // Arrange
        const { sut, updateUserRepository } = makeSut();
        const updateUserRepositorySpy = jest.spyOn(
            updateUserRepository,
            'execute',
        );

        const updateUserParams = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        };

        // Act
        await sut.execute(user.id, updateUserParams);

        //  Assert
        expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
            ...updateUserParams,
            password: 'hashed_password',
        });
    });

    it('should throw if GetUserByEmailRepository throws', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            email: faker.internet.email(),
        });

        //  Assert

        await expect(promise).rejects.toThrow();
    });

    it('should throw if PasswordHasherAdapter throws', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValue(
            new Error(),
        );

        // Act
        const promise = sut.execute(faker.string.uuid(), {
            password: faker.internet.password(),
        });

        //  Assert

        await expect(promise).rejects.toThrow();
    });
});
