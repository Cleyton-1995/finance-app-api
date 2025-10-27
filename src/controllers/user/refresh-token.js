import { badRequest, ok, serverError, unauthorized } from '../helpers/index.js';
import { UnauthorizedError } from '../../errors/index.js';
import { refreshTokenSchema } from '../../schemas/index.js';
import { ZodError } from 'zod';

export class RefreshTokenController {
    constructor(refreshTokenUseCase) {
        this.refreshTokenUseCase = refreshTokenUseCase;
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body;
            await refreshTokenSchema.parseAsync(params);
            const response = this.refreshTokenUseCase.execute(
                params.refreshToken,
            );
            return ok(response);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((issue) => issue.message);
                return badRequest({
                    message: messages.length === 1 ? messages[0] : messages,
                });
            }

            if (error instanceof UnauthorizedError) {
                return unauthorized();
            }
            return serverError();
        }
    }
}
