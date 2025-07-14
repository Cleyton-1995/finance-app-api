import { ZodError } from 'zod';
import { badRequest, created, serverError } from '../helpers/index.js';
import { EmailAlreadyIsUserError } from '../../errors/user.js';
import { createUserSchema } from '../../schemas/index.js';

export class CreateUserController {
    constructor(createUserCase) {
        this.createUserCase = createUserCase;
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            await createUserSchema.parseAsync(params);

            const createdUser = await this.createUserCase.execute(params);

            return created(createdUser);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((issue) => issue.message);
                return badRequest({
                    message: messages.length === 1 ? messages[0] : messages,
                });
            }

            if (error instanceof EmailAlreadyIsUserError) {
                return badRequest({ message: error.message });
            }

            return serverError();
        }
    }
}
