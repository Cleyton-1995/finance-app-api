import { CreateUserCase } from './create-user';
import { EmailAlreadyIsUserError } from '../../errors/user';
import { user as fixtureUser } from '../../tests';

describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    };

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password';
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated_id';
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            };
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const createUserRepository = new CreateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();

        const sut = new CreateUserCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
        );

        return {
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            tokensGeneratorAdapter,
            sut,
        };
    };

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const createUser = await sut.execute(user);

        //  Assert
        expect(createUser).toBeTruthy();
        expect(createUser.tokens.accessToken).toBeDefined();
        expect(createUser.tokens.refreshToken).toBeDefined();
    });

    it('should throws an EmailAlreadyIsUserError if GetUserByEmailRepository returns a user ', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        );

        // Act
        const promise = sut.execute(user);

        //  Assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyIsUserError(user.email),
        );
    });

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        // Arrange
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute');
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        );

        // Act
        await sut.execute(user);

        //  Assert
        expect(idGeneratorSpy).toHaveBeenCalled();
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        });
    });

    it('should call PasswordHasherAdapter a criptograph password', async () => {
        // Arrange
        const {
            sut,

            createUserRepository,
            passwordHasherAdapter,
        } = makeSut();

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute');
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        );

        // Act
        await sut.execute(user);

        //  Assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password);
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        });
    });

    it('should throw if GetUserByEmailRepository throws', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(user);

        //  Assert
        expect(promise).rejects.toThrow();
    });

    it('should throw if IdGeneratorAdapter throws', async () => {
        // Arrange
        const { sut, idGeneratorAdapter } = makeSut();

        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error();
        });

        // Act
        const promise = sut.execute(user);

        //  Assert
        expect(promise).rejects.toThrow();
    });

    it('should throw if PasswordHasherAdapter throws', async () => {
        // Arrange
        const { sut, passwordHasherAdapter } = makeSut();

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(user);

        //  Assert
        expect(promise).rejects.toThrow();
    });

    it('should throw if CreateUserRepository throws', async () => {
        // Arrange
        const { sut, createUserRepository } = makeSut();

        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const promise = sut.execute(user);

        //  Assert
        expect(promise).rejects.toThrow();
    });
});
