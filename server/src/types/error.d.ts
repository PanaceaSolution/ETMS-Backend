import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Extend Express Error
export type KnownErrors =
  | AppError
  | JsonWebTokenError
  | TokenExpiredError
  | TypeError
  | { name: 'ValidationError'; message: string }
  | { name: 'CastError'; message: string };
