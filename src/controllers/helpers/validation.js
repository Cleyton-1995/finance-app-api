import { badRequest } from './http.js';
import validator from 'validator';

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
    badRequest({
        message: `The provided id is not valid.`,
    });

export const requiredFieldIsMissingResponse = (field) => {
    return badRequest({
        message: `The field ${field} is required.`,
    });
};
