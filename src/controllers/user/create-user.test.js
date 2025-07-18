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
        expect(result.body).toBe(httpRequest.body);
    });

    it('should reaturn 400 if first_name is not provided', async () => {
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
});
