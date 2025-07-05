import { EmailAlreadyIsUserError } from '../../errors/user.js';
import {
    badRequest,
    created,
    serverError,
    checkIfPasswordIsValid,
    emailAlreadyIsUserResponse,
    invalidPasswordResponse,
    checkIfEmailIsValid,
} from '../helpers/index.js';
import {
    requiredFieldIsMissingResponse,
    validationRequiredFields,
} from '../helpers/validation.js';

export class CreateUserController {
    constructor(createUserCase) {
        this.createUserCase = createUserCase;
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const { ok: requiredFieldWhereProvided, missingField } =
                validationRequiredFields(params, requiredFields);

            if (!requiredFieldWhereProvided) {
                return requiredFieldIsMissingResponse(missingField);
            }

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

            const createdUser = await this.createUserCase.execute(params);

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
