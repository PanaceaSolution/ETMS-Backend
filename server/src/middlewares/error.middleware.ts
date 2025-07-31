import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { KnownErrors } from '../types/error';

// 404 handler
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Global error handler
export const errorHandler: ErrorRequestHandler = (err: unknown, _req: Request, res: Response) => {
  const error = err as KnownErrors;
  console.error('❌ Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  switch (error.name) {
    case 'CastError':
      return res.status(400).json({ success: false, message: 'Malformatted ID' });
    case 'ValidationError':
      return res.status(400).json({ success: false, message: error.message });
    case 'JsonWebTokenError':
      return res.status(401).json({ success: false, message: 'Invalid token' });
    case 'TokenExpiredError':
      return res.status(401).json({ success: false, message: 'Token expired' });
    case 'TypeError':
      return res.status(400).json({ success: false, message: error.message });
  }

  // Fallback
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
