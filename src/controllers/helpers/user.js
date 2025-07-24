import { badRequest, notFound } from './http.js';
import validator from 'validator';
export const invalidIdResponse = () =>
    badRequest({
        message: `The provided id is not valid.`,
    });

export const userNotFoundResponse = () =>
    notFound({ Message: 'User not found.' });

export const checkIfIdIsValid = (id) => validator.isUUID(id);
