import { faker } from '@faker-js/faker';
import { CreateUserCase } from './create-user';

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
            GetUserByEmailRepositoryStub,
            CreateUserRepositoryStub,
            PasswordHasherAdapterStub,
            IdGeneratorAdapterStub,
            sut,
        };
    };

    it('should successfully create a user', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const createUser = await sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        });

        //  Assert
        expect(createUser).toBeTruthy();
    });
});
