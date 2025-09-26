import 'dotenv/config.js';
import express from 'express';

import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionsController,
} from './src/factories/controllers/transaction.js';
import { usersRouter } from './src/routers/user.js';

const app = express();

app.use(express.json());

app.use('/api/users', usersRouter);
app.post('/api/transactions', async (request, response) => {
    const createTransactionController = makeCreateTransactionController();

    const { statusCode, body } =
        await createTransactionController.execute(request);

    response.status(statusCode).send(body);
});
app.get('/api/transactions', async (request, response) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController();

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(request);

    response.status(statusCode).send(body);
});
app.patch('/api/transactions/:transactionId', async (request, response) => {
    const updateTransactionsController = makeUpdateTransactionsController();

    const { statusCode, body } =
        await updateTransactionsController.execute(request);

    response.status(statusCode).send(body);
});
app.delete('/api/transactions/:transactionId', async (request, response) => {
    const deleteTransactionController = makeDeleteTransactionController();

    const { statusCode, body } =
        await deleteTransactionController.execute(request);

    response.status(statusCode).send(body);
});

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
);
