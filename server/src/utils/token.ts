import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

const EXPIRES_IN = '1d';
const SECRET = JWT_SECRET;

if (!SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, SECRET!, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, SECRET!) as TokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`);
    }
    throw new Error('Authentication failed');
  }
};
