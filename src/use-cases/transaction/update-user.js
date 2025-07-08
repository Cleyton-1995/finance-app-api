import { UserNotFoundError } from '../../errors/user';

export class UpdateTransactionsUseCase {
    constructor(updateTransactionsRepository, getUserByIdRepository) {
        this.updateTransactionsRepository = updateTransactionsRepository;
        this.getUserByIdRepository = getUserByIdRepository;
    }
    async execute(params) {
        const user = await this.getUserByIdRepository.execute(params.userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        const transactions =
            await this.updateTransactionsRepository.execute(params);

        return transactions;
    }
}
