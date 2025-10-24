import { EmailAlreadyIsUserError } from '../../errors/user.js';

export class CreateUserCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.postgresGetUserByEmailRepository =
            postgresGetUserByEmailRepository;

        this.postgresCreateUserRepository = postgresCreateUserRepository;
        this.passwordHasherAdapter = passwordHasherAdapter;
        this.idGeneratorAdapter = idGeneratorAdapter;
        this.tokensGeneratorAdapter = tokensGeneratorAdapter;
    }

    async execute(createUserParams) {
        const userWithProviderEmail =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            );

        if (userWithProviderEmail) {
            throw new EmailAlreadyIsUserError(createUserParams.email);
        }

        const userId = await this.idGeneratorAdapter.execute();

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

        return {
            ...createdUser,
            tokens: this.tokensGeneratorAdapter.execute(userId),
        };
    }
}
