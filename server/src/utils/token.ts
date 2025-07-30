import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

const EXPIRES_IN = '1d';
const SECRET = JWT_SECRET;

if(!SECRET) {
    throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, SECRET!, { expiresIn: EXPIRES_IN });
}

export const verifyToken = (token: string): { userId: string } => {
    return jwt.verify(token, SECRET!) as { userId: string }
}