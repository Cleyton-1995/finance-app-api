import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js';
import { notFound, ok, serverError } from './helpers/http.js';
import validator from 'validator';
import { invalidIdResponse } from './helpers/user.js';

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIsValid = validator.isUUID(httpRequest.params.userId);

            if (!isIsValid) {
                return invalidIdResponse();
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            );

            if (!user) {
                return notFound({
                    message: 'User not found.',
                });
            }

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
