import { PostgresHelper } from '../../../db/postgres/helper.js';

export class PostgresUpdateTransactionsRepository {
    async execute(transactionId, updateTransactionsParams) {
        const updateFields = [];
        const updateValues = [];

        Object.keys(updateTransactionsParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`);
            updateValues.push(updateTransactionsParams[key]);
        });

        updateValues.push(transactionId);

        const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id = $${updateValues.length}
            RETURNING *
        `;

        const updateUser = await PostgresHelper.query(
            updateQuery,
            updateValues,
        );

        return updateUser[0];
    }
}
