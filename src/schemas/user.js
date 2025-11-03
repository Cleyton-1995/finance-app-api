import { z } from 'zod';

export const createUserSchema = z.object({
    first_name: z
        .string({
            required_error: 'First name is required.',
        })
        .trim()
        .min(1, {
            message: 'First name is required.',
        }),
    last_name: z
        .string({
            required_error: 'Last name is required.',
        })
        .trim()
        .min(1, {
            message: 'Last name is required',
        }),
    email: z
        .string({
            required_error: 'E-mail is required.',
        })
        .email({
            message: 'Please provide a valid e-mail.',
        })
        .trim()
        .min(1, {
            message: 'E-mail is required.',
        }),
    password: z
        .string({
            required_error: 'Password is required.',
        })
        .trim()
        .min(6, {
            message: 'Password must have at least 6 characters.',
        }),
});

export const updateUserSchema = createUserSchema.partial().strict();

export const loginSchema = z.object({
    email: z
        .string()
        .email({
            message: 'Please provide a valid e-mail.',
        })
        .trim()
        .min(1, {
            message: 'E-mail is required.',
        }),
    password: z.string().trim().min(6, {
        message: 'Password must have at least 6 characters.',
    }),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().trim().min(1, {
        message: 'Refresh token is required.',
    }),
});

export const getUserBalanceSchema = z.object({
    userId: z.string().uuid({
        message: 'User ID must be a valid UUID.',
    }),
    from: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: 'Invalid "from" date format (expected YYYY-MM-DD).',
        }),
    to: z
        .string()
        .optional()
        .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
            message: 'Invalid "to" date format (expected YYYY-MM-DD).',
        }),
});
