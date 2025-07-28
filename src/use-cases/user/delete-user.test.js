import { faker } from '@faker-js/faker';
import { DeleteUserUseCase } from './delete-user';

describe('DeleteUserUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 6,
        }),
    };

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
});
