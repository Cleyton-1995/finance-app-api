import { CreateUserCase } from '../use-cases/create-user.js';

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return {
                        statusCode: 400,
                        body: {
                            errorMessage: `Missing param: ${field}`,
                        },
                    };
                }
            }

            const createUserCase = new CreateUserCase();

            const createdUser = await createUserCase.execute(params);

            return {
                statusCode: 201,
                body: createdUser,
            };
        } catch (error) {
            console.log(error);

            return {
                statusCode: 500,
                body: {
                    errorMessage: `Internal server error`,
                },
            };
        }
    }
}
