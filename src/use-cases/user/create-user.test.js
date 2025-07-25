import { faker } from '@faker-js/faker';
import { CreateUserCase } from './create-user';
import { EmailAlreadyIsUserError } from '../../errors/user';

describe('CreateUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null;
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
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

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
        const createUserRepository = new CreateUserRepositoryStub();
        const passwordHasherAdapter = new PasswordHasherAdapterStub();
        const idGeneratorAdapter = new IdGeneratorAdapterStub();

        const sut = new CreateUserCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        );

        return {
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
            sut,
        };
    };

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 6,
        }),
    };

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const createUser = await sut.execute(user);

        //  Assert
        expect(createUser).toBeTruthy();
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
});
