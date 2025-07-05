import {
    created,
    invalidAmoutResponse,
    invalidTypeResponse,
    serverError,
} from '../helpers/index.js';
import {
    checkIfTypeIsValid,
    checkIfAmountIsValid,
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
} from '../helpers/index.js';
import {
    requiredFieldIsMissingResponse,
    validationRequiredFields,
} from '../helpers/validation.js';

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase;
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body;

            const requiredFields = [
                'user_id',
                'name',
                'date',
                'amount',
                'type',
            ];

            const { ok: requiredFieldWhereProvided, missingField } =
                validationRequiredFields(params, requiredFields);

            if (!requiredFieldWhereProvided) {
                return requiredFieldIsMissingResponse(missingField);
            }

            const userIdIsValid = checkIfIdIsValid(params.user_id);

            if (!userIdIsValid) {
                return invalidIdResponse();
            }

            if (params.amount <= 0) {
                return badRequest({
                    message: 'The amount must be greater than 0.',
                });
            }

            const amountIsValid = checkIfAmountIsValid(params.amount);

            if (!amountIsValid) {
                return invalidAmoutResponse();
            }

            const type = params.type.trim().toUpperCase();

            const typeIsValid = checkIfTypeIsValid(type);

            if (!typeIsValid) {
                return invalidTypeResponse();
            }

            const transaction = await this.createTransactionUseCase.execute({
                ...params,
                type,
            });

            return created(transaction);
        } catch (error) {
            console.error(error);
            return serverError();
        }
    }
}
