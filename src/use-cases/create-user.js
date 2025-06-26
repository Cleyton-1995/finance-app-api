import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user';

export class CreateUserCase {
    async execute(createUserParams) {
        const userId = uuidv4;

        const hashedPassword = await bcrypt.hash(createUserParams.password);

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        };

        const postgresCreateUserRepository = PostgresCreateUserRepository();

        const createdUser = await postgresCreateUserRepository.execute(user);

        return createdUser;
    }
}
