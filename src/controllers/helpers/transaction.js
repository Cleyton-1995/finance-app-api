import { notFound } from './http.js';

export const transactionNotFoundResponse = () => {
    return notFound({ Message: 'Transaction not found.' });
};
