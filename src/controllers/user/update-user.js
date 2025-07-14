import { ZodError } from 'zod';
import { EmailAlreadyIsUserError } from '../../errors/user.js';
import { updateUserSchema } from '../../schemas/index.js';
import {
    badRequest,
    ok,
    serverError,
    invalidIdResponse,
    checkIfIdIsValid,
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

            await updateUserSchema.parseAsync(params);

            const updateUser = await this.updateUserUseCase.execute(
                userId,
                params,
            );

            return ok(updateUser);
        } catch (error) {
            if (error instanceof ZodError) {
                const issues = error.issues.map((issue) => {
                    if (issue.code === 'unrecognized_keys') {
                        return 'Some provided field is not allowed.';
                    }
                    return issue.message;
                });

                return badRequest({
                    message: issues.length === 1 ? issues[0] : issues,
                });
            }

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
