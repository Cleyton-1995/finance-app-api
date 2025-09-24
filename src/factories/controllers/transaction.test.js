import {
    CreateTransactionController,
    DeleteTransactionController,
    UpdateTransactionsController,
} from '../../controllers';
import {
    makeCreateTransactionController,
    makeDeleteTransactionController,
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

    it('should return a valid DeleteTransactionController instance', () => {
        expect(makeDeleteTransactionController()).toBeInstanceOf(
            DeleteTransactionController,
        );
    });
});
