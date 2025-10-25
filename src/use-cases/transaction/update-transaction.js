import { ForbiddenError } from '../../errors/index.js';
import { TransactionNotFoundError } from '../../errors/transaction.js';

export class UpdateTransactionsUseCase {
    constructor(updateTransactionsRepository, getTransactionByIdRepository) {
        this.updateTransactionsRepository = updateTransactionsRepository;
        this.getTransactionByIdRepository = getTransactionByIdRepository;
    }

    async execute(transactionId, params) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId);

        if (params?.userId && transaction.user_id !== params.user_id) {
            throw new ForbiddenError();
        }
        if (!transaction) {
            throw new TransactionNotFoundError();
        }

        return await this.updateTransactionsRepository.execute(
            transactionId,
            params,
        );
    }
}
