import { faker } from '@faker-js/faker';
import { CreateUserController } from './create-user';
import { EmailAlreadyIsUserError } from '../../errors/user';
import { user } from '../../tests';

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        async execute() {
            return user;
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub();
        const sut = new CreateUserController(createUserUseCase);

        return { createUserUseCase, sut };
    };

    const httpRequest = {
        body: {
            ...user,
            id: undefined,
        },
    };

    it('should return 201 when creating a user successfully', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(user);
    });

    it('should return 400 if first_name is not provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                first_name: undefined,
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if last_name is not provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                last_name: undefined,
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: undefined,
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        // Arrange
        const { sut } = makeSut();
        // Act
        const result = await sut.execute({
            body: {
                ...httpRequest.body,
                password: undefined,
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is less than 6 characters', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
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

    it('should call CreateUserUseCase with correct params', async () => {
        // Arrange
        const { sut, createUserUseCase } = makeSut();

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        // Act
        await sut.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it('should return 500 if CreateUserUseCase throws', async () => {
        // Arrange
        const { sut, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(500);
    });

    it('should return 400 if CreateUserUseCase throws EmailAlreadyIsUserError', async () => {
        // Arrange
        const { sut, createUserUseCase } = makeSut();

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyIsUserError(httpRequest.body.email),
        );

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });
});
