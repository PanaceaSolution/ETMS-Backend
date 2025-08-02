import { Response, NextFunction } from 'express';
import { logger } from '@utils/logger';
import { AuthenticatedRequest } from '#types/auth';

/**
 * Logs request method, path, body, status, duration, and optionally userId.
 */
export const requestLogger = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  logger.info('➡️ Request Start');
  logger.info('Method:', req.method);
  logger.info('Path:', req.originalUrl);

  if (req.userId) {
    logger.info('User:', req.userId);
  }

  if (Object.keys(req.body || {}).length > 0) {
    logger.info('Body:', req.body);
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`✅ ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    logger.info('⬅️ Request End');
    logger.info('---');
  });

  next();
};
