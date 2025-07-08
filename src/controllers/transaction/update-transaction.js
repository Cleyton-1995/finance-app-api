import {
    badRequest,
    checkIfAmountIsValid,
    checkIfIdIsValid,
    checkIfTypeIsValid,
    invalidAmoutResponse,
    invalidIdResponse,
    invalidTypeResponse,
    ok,
    serverError,
} from '../helpers/index.js';

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

            const allowedFields = ['name', 'date', 'amount', 'type'];

            const someFieldsIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );

            if (someFieldsIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed',
                });
            }

            if (params.amount) {
                const amountIsvalid = checkIfAmountIsValid(params.amount);

                if (!amountIsvalid) {
                    return invalidAmoutResponse();
                }
            }

            if (params.type) {
                const typeIsValid = checkIfTypeIsValid(params.type);

                if (!typeIsValid) {
                    return invalidTypeResponse();
                }
            }

            const transactions = await this.updateTransactionsUseCase.execute(
                httpRequest.params.transactionId,
                params,
            );

            return ok(transactions);
        } catch (error) {
            console.error(error);

            return serverError();
        }
    }
}
