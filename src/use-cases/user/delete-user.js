export class DeleteUserUseCase {
    constructor(postgresDeleteUserRepository) {
        this.postgresDeleteUserRepository = postgresDeleteUserRepository;
    }
    async execute(userId) {
        const deleteUser =
            await this.postgresDeleteUserRepository.execute(userId);

        return deleteUser;
    }
}
