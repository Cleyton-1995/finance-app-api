import { Router } from 'express';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionsController,
} from '../factories/controllers/transaction.js';
import { auth } from '../middlewares/auth.js';

export const transactionsRouter = Router();

transactionsRouter.post('/me', auth, async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } = await createTransactionController.execute({
        ...request,
        body: {
            ...request.body,
            user_id: request.userId,
        },
    });

    response.status(statusCode).send(body);
});
transactionsRouter.get('/me', auth, async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute({
            ...request,
            query: {
                ...request.query,
                from: request.query.from,
                to: request.query.to,
                userId: request.userId,
            },
        });

    response.status(statusCode).send(body);
});
transactionsRouter.patch(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const updateTransactionsController = makeUpdateTransactionsController();

        const { statusCode, body } = await updateTransactionsController.execute(
            {
                ...request,
                query: {
                    ...request.query,
                    userId: request.userId,
                },
            },
        );

        response.status(statusCode).send(body);
    },
);
transactionsRouter.delete(
    '/me/:transactionId',
    auth,
    async (request, response) => {
        const deleteTransactionController = makeDeleteTransactionController();

        const { statusCode, body } = await deleteTransactionController.execute({
            params: {
                transactionId: request.params.transactionId,
                user_id: request.userId,
            },
        });

        response.status(statusCode).send(body);
    },
);
