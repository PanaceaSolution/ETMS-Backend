import dotenv from 'dotenv';

dotenv.config();

const rawPort = process.env.PORT ?? '3000';
export const PORT = parseInt(rawPort, 10);
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const CLIENT_URL = process.env.CLIENT_URL;
