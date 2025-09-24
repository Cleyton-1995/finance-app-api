import {
    CreateTransactionController,
    UpdateTransactionsController,
} from '../../controllers';
import {
    makeCreateTransactionController,
    makeUpdateTransactionsController,
} from './transaction';

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        );
    });

    it('should return a valid UpdateTransactionController instance', () => {
        expect(makeUpdateTransactionsController()).toBeInstanceOf(
            UpdateTransactionsController,
        );
    });
});
