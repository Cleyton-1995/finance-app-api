import bcrypt from 'bcrypt';
import { EmailAlreadyIsUserError } from '../errors/user.js';
import {
    PostgresUpdateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js';

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository();

            const userWithProviderEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                );

            if (userWithProviderEmail && userWithProviderEmail.id !== userId) {
                throw new EmailAlreadyIsUserError(updateUserParams.email);
            }
        }

        const user = {
            ...updateUserParams,
        };

        if (updateUserParams.password) {
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            );

            user.password = hashedPassword;
        }

        const postgresUpdateUserRepository = new PostgresUpdateUserRepository();

        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        );

        return updateUser;
    }
}
