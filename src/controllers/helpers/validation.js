import { badRequest } from './http.js';
import validator from 'validator';

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
    badRequest({
        message: `The provided id is not valid.`,
    });

export const checkIfIdIsString = (value) => typeof value === 'string';

export const validationRequiredFields = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldIsMissing =
            params[field] === undefined || params[field] === null;

        const fieldIsEmpty =
            checkIfIdIsString(params[field]) &&
            validator.isEmpty(params[field], {
                ignore_whitespace: true,
            });

        if (fieldIsMissing || fieldIsEmpty) {
            return {
                missingField: field,
                ok: false,
            };
        }
    }

    return {
        ok: true,
        missingField: undefined,
    };
};
