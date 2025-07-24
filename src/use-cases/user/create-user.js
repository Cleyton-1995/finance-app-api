import { v4 as uuidv4 } from 'uuid';
import { EmailAlreadyIsUserError } from '../../errors/user.js';

export class CreateUserCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        passwordHasherAdapter,
    ) {
        this.postgresGetUserByEmailRepository =
            postgresGetUserByEmailRepository;

        this.postgresCreateUserRepository = postgresCreateUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
    }

    async execute(createUserParams) {
        const userWithProviderEmail =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            );

        if (userWithProviderEmail) {
            throw new EmailAlreadyIsUserError(createUserParams.email);
        }

        const userId = uuidv4();

        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        );

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const createdUser =
            await this.postgresCreateUserRepository.execute(user);

        return createdUser;
    }
}
