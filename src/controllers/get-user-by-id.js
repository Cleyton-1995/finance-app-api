import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import { badRequest, ok, serverError } from './helpers.js';
import validator from 'validator';

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIsValid = validator.isUUID(httpRequest.params.userId);

            if (!isIsValid) {
                return badRequest({
                    message: `The provided id is not valid.`,
                });
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            );

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
