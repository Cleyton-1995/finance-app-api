import { CreateUserController } from './create-user';

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user;
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                email: 'cleyton@gmail.com',
                password: '123456',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(201);
        expect(result.body).toEqual(httpRequest.body);
    });

    it('should return 400 if first_name is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                last_name: 'Costa',
                email: 'cleyton@gmail.com',
                password: '123456',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if last_name is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                email: 'cleyton@gmail.com',
                password: '123456',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                password: '123456',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if email is not valid', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                email: 'cleyton',
                password: '123456',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                email: 'cleyton@gmail.com',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should return 400 if password is less than 6 characters', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                email: 'cleyton@gmail.com',
                password: '12345',
            },
        };

        // Act
        const result = await createUserController.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(400);
    });

    it('should call CreateUserUseCase with correct params', async () => {
        // Arrange
        const createUserUseCase = new CreateUserUseCaseStub();
        const createUserController = new CreateUserController(
            createUserUseCase,
        );

        const httpRequest = {
            body: {
                first_name: 'Cleyton',
                last_name: 'Costa',
                email: 'cleyton@gmail.com',
                password: '123456',
            },
        };

        const executeSpy = jest.spyOn(createUserUseCase, 'execute');

        // Act
        await createUserController.execute(httpRequest);

        //  Assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
    });
});
