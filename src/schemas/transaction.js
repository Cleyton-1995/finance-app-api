import { z } from 'zod';
import validator from 'validator';

export const createTransactionSchema = z.object({
    user_id: z
        .string({
            required_error: 'User ID is required.',
        })
        .uuid({
            message: 'User ID must be a valid UUID.',
        }),
    name: z
        .string({
            required_error: 'Name is required.',
        })
        .trim()
        .min(1, {
            message: 'Name is required.',
        }),
    date: z
        .string({
            required_error: 'Date is required.',
        })
        .refine(
            (val) =>
                /^\d{4}-\d{2}-\d{2}$/.test(val) ||
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.+)?$/.test(val),
            {
                message: 'Date must be in YYYY-MM-DD or ISO 8601 format.',
            },
        ),
    type: z
        .string({
            required_error: 'Type is required.',
            invalid_type_error: 'Type must be a string.',
        })
        .refine((val) => ['EXPENSE', 'EARNING', 'INVESTMENT'].includes(val), {
            message: 'Type must be one of: EXPENSE, EARNING or INVESTMENT.',
        }),
    amount: z
        .number({
            required_error: 'Amount is required.',
            invalid_type_error: 'Amount must be a number.',
        })
        .min(1, {
            message: 'Amount must be greater than 0.',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
});

export const updateTransactionSchema = createTransactionSchema
    .omit({
        user_id: true,
    })
    .partial()
    .strict({
        message: 'Some provided fields is not allowed',
    });

export const getTransactionsByUserIdSchema = z.object({
    user_id: z.string().uuid(),
    from: z.string().date(),
    to: z.string().date(),
});
