import express from 'express';

import { usersRouter, transactionsRouter } from './routers/index.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

export const app = express();

// Enable CORS for all routes (adjust origin as needed for production)
app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/transactions', transactionsRouter);

// Use process.cwd() for Jest compatibility instead of import.meta
const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf8'),
);

// If host is hardcoded, let Swagger UI infer it from the request by removing it
if (swaggerDocument.host) {
    delete swaggerDocument.host;
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
