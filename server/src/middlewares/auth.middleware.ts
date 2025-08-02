import { Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '@utils/token';
import { AppError } from '@utils/AppError';
import { AuthenticatedRequest } from '#types/auth';

export const protectedRoute = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.toLowerCase().startsWith('bearer ')) {
    return next(new AppError('Unauthorized: Token missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Unauthorized: Token missing', 401));
  }

  const decoded: TokenPayload = verifyToken(token);
  if (!decoded.userId) {
    return next(new AppError('Unauthorized: Invalid token payload', 401));
  }

  req.userId = decoded.userId;
  next();
};
