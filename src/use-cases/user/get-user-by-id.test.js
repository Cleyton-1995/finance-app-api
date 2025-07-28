import { faker } from '@faker-js/faker';
import { GetUserByIdUseCase } from './get-user-by-id';

describe('GetUserByIdUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 6,
        }),
    };

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
});
