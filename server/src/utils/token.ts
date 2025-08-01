import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@config/env';
import { AppError } from '@utils/AppError';

const EXPIRES_IN = '1d';
const SECRET = JWT_SECRET;
const { JsonWebTokenError, TokenExpiredError } = jwt;
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
      throw new AppError('Token has expired', 401, 'TokenExpiredError');
    }
    if (error instanceof JsonWebTokenError) {
      throw new AppError(`Invalid token: ${error.message}`, 401, 'JsonWebTokenError');
    }
    throw new AppError('Authentication failed', 401, 'AuthError');
  }
};
