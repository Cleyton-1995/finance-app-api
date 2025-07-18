import { badRequest, notFound } from './http.js';
import validator from 'validator';

export const invalidPasswordResponse = () =>
    badRequest({
        message: `Password must be at least 6 characters`,
    });

export const emailAlreadyIsUserResponse = () =>
    badRequest({
        message: `Invalid email. Please provide a valid one.`,
    });

export const invalidIdResponse = () =>
    badRequest({
        message: `The provided id is not valid.`,
    });

export const userNotFoundResponse = () =>
    notFound({ Message: 'User not found.' });

export const checkIfPasswordIsValid = (password) => password.length < 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);

export const checkIfIdIsValid = (id) => validator.isUUID(id);
