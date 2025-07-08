export class UpdateTransactionsUseCase {
    constructor(updateTransactionsRepository) {
        this.updateTransactionsRepository = updateTransactionsRepository;
    }

    async execute(transactionId, params) {
        return await this.updateTransactionsRepository.execute(
            transactionId,
            params,
        );
    }
}
