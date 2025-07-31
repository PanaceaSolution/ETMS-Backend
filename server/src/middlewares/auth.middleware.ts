import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const protectedRoute = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: TokenPayload = verifyToken(token);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Unauthorized: Token expired' });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: `Unauthorized: ${error.message}` });
    }
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
