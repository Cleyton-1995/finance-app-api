import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js';
import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js';
import { CreateTransactionUseCase } from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();

    const getUserByIdRepository = PostgresGetUserByIdRepository();

    const createTransactionUseCase = CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    );

    const createTransactionController = CreateTransactionController(
        createTransactionUseCase,
    );

    return createTransactionController;
};
