import 'dotenv/config.js'; // <- PRIMEIRO DE TUDO
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../helper.js'; // <- SÓ depois de carregar dotenv

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execMigrations = async () => {
    const client = await pool.connect();

    try {
        const files = fs
            .readdirSync(__dirname)
            .filter((file) => file.endsWith('.sql'));

        for (const file of files) {
            const filePath = path.join(__dirname, file);
            const script = fs.readFileSync(filePath, 'utf-8');

            await client.query(script);

            console.log(`Migration for file ${file} executed successfully`);
        }
        console.log('All migrations were executed successfully!');
    } catch (error) {
        console.error(error); // <- use error completo
    } finally {
        client.release();
    }
};

execMigrations();
