import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.resolve(__dirname, '../.env') });

console.log('Database Config:',{
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    user: process.env.USER || "",
    password: process.env.PASSWORD ||  ""

});

export default process.env;
