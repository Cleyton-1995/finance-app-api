import { GetUserByIdUseCase } from '../use-cases/index.js';
import {
    ok,
    serverError,
    invalidIdResponse,
    checkIfIdIsValid,
    userNotFoundResponse,
} from './helpers/index.js';

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIsValid = checkIfIdIsValid(httpRequest.params.userId);

            if (!isIsValid) {
                return invalidIdResponse();
            }

            const getUserByIdUseCase = new GetUserByIdUseCase();

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            );

            if (!user) {
                return userNotFoundResponse();
            }

            return ok(user);
        } catch (error) {
            console.log(error);
            return serverError();
        }
    }
}
