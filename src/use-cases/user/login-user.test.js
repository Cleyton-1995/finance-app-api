import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js';
import { LoginUserUseCase } from './login-user.js';
import { user } from '../../tests/fixtures/user.js';

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user;
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true;
        }
    }

    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            };
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub();
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        );
        return {
            sut,
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        };
    };

    it('should throw UserNotFoundError if user not found', async () => {
        // Arrange
        const { sut, getUserByEmailRepository } = makeSut();
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            null,
        );
        const promise = sut.execute('any_email', 'any_password');

        // Assert
        await expect(promise).rejects.toThrow(new UserNotFoundError());
    });

    it('should throw InvalidPasswordError if password is invalid', async () => {
        // Arrange
        const { sut, passwordComparatorAdapter } = makeSut();
        jest.spyOn(passwordComparatorAdapter, 'execute').mockReturnValue(false);
        const promise = sut.execute('any_email', 'any_password');
        await expect(promise).rejects.toThrow(new InvalidPasswordError());
    });

    it('should return user with tokens', async () => {
        // Arrange
        const { sut } = makeSut();
        const result = await sut.execute('any_email', 'any_password');
        expect(result.tokens.accessToken).toBeDefined();
    });
});
