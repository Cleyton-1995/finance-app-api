export class UpdateTransactionsUseCase {
    constructor(updateTransactionsRepository) {
        this.updateTransactionsRepository = updateTransactionsRepository;
    }
    async execute(transactionId, params) {
        const transactions = await this.updateTransactionsRepository.execute(
            params,
            transactionId,
        );

        return transactions;
    }
}
