import { faker } from '@faker-js/faker';
import { UpdateUserController } from './update-user';
import { EmailAlreadyIsUserError } from '../../errors/user';

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute(user) {
            return user;
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub();
        const sut = new UpdateUserController(updateUserUseCase);

        return { updateUserUseCase, sut };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 6,
            }),
        },
    };

    it('should return 200 when updating a user successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 when an invalid email is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when an invalid password is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({
                    length: 5,
                }),
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when an invalid id is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 when an anallowed fields is provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                anallowed_fields: 'anallowed_value',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 500 if UpdateUserUseCase throws with generic error', async () => {
        // Arrange
        const { sut, updateUserUseCase } = makeSut();
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyIsUserError', async () => {
        // Arrange
        const { sut, updateUserUseCase } = makeSut();

        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyIsUserError(faker.internet.email()),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should call UpdateUserUseCase with correct params', async () => {
        // Arrange
        const { sut, updateUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(updateUserUseCase, 'execute');

        // Act
        await sut.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        );
    });
});
