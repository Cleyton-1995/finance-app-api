import { ZodError } from 'zod';
import { updateTransactionSchema } from '../../schemas/transaction.js';
import {
    badRequest,
    checkIfIdIsValid,
    forbidden,
    invalidIdResponse,
    ok,
    serverError,
    transactionNotFoundResponse,
} from '../helpers/index.js';
import { TransactionNotFoundError } from '../../errors/transaction.js';
import { ForbiddenError } from '../../errors/index.js';

export class UpdateTransactionsController {
    constructor(updateTransactionsUseCase) {
        this.updateTransactionsUseCase = updateTransactionsUseCase;
    }
    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(
                httpRequest.params.transactionId,
            );

            if (!idIsValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            await updateTransactionSchema.parseAsync(params);

            const transactions = await this.updateTransactionsUseCase.execute(
                httpRequest.params.transactionId,
                params,
            );

            return ok(transactions);
        } catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((issue) => issue.message);
                return badRequest({
                    message: messages.length === 1 ? messages[0] : messages,
                });
            }

            if (error instanceof TransactionNotFoundError) {
                return transactionNotFoundResponse();
            }

            if (error instanceof ForbiddenError) {
                return forbidden();
            }

            console.error(error);

            return serverError();
        }
    }
}
