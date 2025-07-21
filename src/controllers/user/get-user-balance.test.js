import { faker } from '@faker-js/faker';
import { GetUserBalanceController } from './get-user-balance';

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return faker.number.int();
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub();
        const sut = new GetUserBalanceController(getUserBalanceUseCase);

        return { getUserBalanceUseCase, sut };
    };

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    };

    it('should return 200 when getting user balance', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute(httpRequest);

        //  Assert
        expect(result.statusCode).toBe(200);
    });

    it('should return 400 if userId is invalid', async () => {
        // Arrange
        const { sut } = makeSut();

        // Act
        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        });

        //  Assert
        expect(result.statusCode).toBe(400);
    });
});
