import { prisma } from '../../../../prisma/prisma.js';
import { UserNotFoundError } from '../../../errors/user.js';

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        try {
            return await prisma.user.update({
                where: {
                    id: userId,
                },
                data: updateUserParams,
            });
        } catch (error) {
            // Map Prisma's "record not found for update" to a domain error
            if (error && error.code === 'P2025') {
                throw new UserNotFoundError(userId);
            }

            throw error;
        }
    }
}
