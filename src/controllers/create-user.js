import { CreateUserCase } from '../use-cases/index.js';
import { EmailAlreadyIsUserError } from '../errors/user.js';
import {
    badRequest,
    created,
    serverError,
    checkIfPasswordIsValid,
    emailAlreadyIsUserResponse,
    invalidPasswordResponse,
    checkIfEmailIsValid,
} from './helpers/index.js';

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
                    return badRequest({ message: `Missing param: ${field}` });
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password);

            if (passwordIsValid) {
                return invalidPasswordResponse();
            }

            const emailIsValid = checkIfEmailIsValid(params.email);

            if (!emailIsValid) {
                return emailAlreadyIsUserResponse();
            }

            const createUserCase = new CreateUserCase();

            const createdUser = await createUserCase.execute(params);

            return created(createdUser);
        } catch (error) {
            if (error instanceof EmailAlreadyIsUserError) {
                return badRequest({ message: error.message });
            }

            console.log(error);

            return serverError();
        }
    }
}
