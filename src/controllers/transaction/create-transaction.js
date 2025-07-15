import { ZodError } from 'zod';
import { createTransactionSchema } from '../../schemas/index.js';
import { badRequest, created, serverError } from '../helpers/index.js';

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            await createTransactionSchema.parseAsync(params);

            const transaction =
                await this.createTransactionUseCase.execute(params);

            return created(transaction);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((issue) => issue.message);
                return badRequest({
                    message: messages.length === 1 ? messages[0] : messages,
                });
            }

            console.error(error);
            return serverError();
        }
    }
}
