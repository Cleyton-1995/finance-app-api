import bcrypt from 'bcrypt';
import { EmailAlreadyIsUserError } from '../../errors/user.js';

export class UpdateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
    ) {
        this.postgresGetUserByEmailRepository =
            postgresGetUserByEmailRepository;

        this.postgresUpdateUserRepository = postgresUpdateUserRepository;
    }

    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userWithProviderEmail =
                await this.postgresGetUserByEmailRepository.execute(
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

        const updateUser = await this.postgresUpdateUserRepository.execute(
            userId,
            user,
        );

        return updateUser;
    }
}
