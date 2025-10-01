import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/user.js';

export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            });
        } catch (error) {
            // Map Prisma's "record not found for delete" to a domain error
            if (error && error.code === 'P2025') {
                throw new UserNotFoundError(userId);
            }

            throw error;
        }
    }
}
