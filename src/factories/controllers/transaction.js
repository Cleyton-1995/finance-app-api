import { IdGeneratorAdapter } from '../../adapters/index.js';
import {
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionsController,
} from '../../controllers/index.js';
import { CreateTransactionController } from '../../controllers/transaction/create-transaction.js';
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionsRepository,
} from '../../repositories/postgres/index.js';
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionsUseCase,
} from '../../use-cases/index.js';

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();
    const idGeneratorAdapter = new IdGeneratorAdapter();

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    );

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    );

    return createTransactionController;
};

export const makeGetTransactionsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository();

    const getUserByIdRepository = new PostgresGetUserByIdRepository();

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    );

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase);

    return getTransactionsByUserIdController;
};
export const makeUpdateTransactionsController = () => {
    const updateTransactionsRepository =
        new PostgresUpdateTransactionsRepository();

    const updateTransactionsUseCase = new UpdateTransactionsUseCase(
        updateTransactionsRepository,
    );

    const updateTransactionsController = new UpdateTransactionsController(
        updateTransactionsUseCase,
    );

    return updateTransactionsController;
};
export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository();

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
    );

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    );

    return deleteTransactionController;
};
