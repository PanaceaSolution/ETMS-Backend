import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err.message || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};
