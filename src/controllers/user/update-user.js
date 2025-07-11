import { EmailAlreadyIsUserError } from '../../errors/user.js';
import {
    badRequest,
    ok,
    serverError,
    invalidIdResponse,
    checkIfIdIsValid,
    checkIfPasswordIsValid,
    emailAlreadyIsUserResponse,
    invalidPasswordResponse,
    checkIfEmailIsValid,
} from '../helpers/index.js';

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase;
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isIdValid = checkIfIdIsValid(userId);

            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldsIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed',
                });
            }

            if (params.password) {
                const passwordIsValid = checkIfPasswordIsValid(params.password);

                if (passwordIsValid) {
                    return invalidPasswordResponse();
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email);

                if (!emailIsValid) {
                    return emailAlreadyIsUserResponse();
                }
            }

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updateUser);
        } catch (error) {
            if (error instanceof EmailAlreadyIsUserError) {
                return badRequest({
                    message: error.message,
                });
            }

            console.error(error);
            return serverError();
        }
    }
}
