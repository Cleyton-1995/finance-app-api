import { Router } from 'express';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionsController,
} from '../factories/controllers/transaction.js';

export const transactionsRouter = Router();

transactionsRouter.post('/', async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } =
        await createTransactionController.execute(request);

    response.status(statusCode).send(body);
});
transactionsRouter.get('/', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request);

    response.status(statusCode).send(body);
});
transactionsRouter.patch('/:transactionId', async (request, response) => {
    const updateTransactionsController = makeUpdateTransactionsController();

    const { statusCode, body } =
        await updateTransactionsController.execute(request);

    response.status(statusCode).send(body);
});
transactionsRouter.delete('/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController();

    const { statusCode, body } =
        await deleteTransactionController.execute(request);

    response.status(statusCode).send(body);
});
