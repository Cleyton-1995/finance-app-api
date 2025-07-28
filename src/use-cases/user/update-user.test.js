import { faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user';

describe('UpdateUserUseCase', () => {
    const user = {
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
});
