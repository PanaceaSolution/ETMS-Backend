import { RequestHandler, ErrorRequestHandler, Request, Response, NextFunction } from 'express';

export type AsyncableRequestHandler<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
  res: Response<ResBody, Locals>,
  next: NextFunction,
) => void | Promise<unknown>;

// union of all valid handlers
export type HandlerUnion<
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
  Locals extends Record<string, unknown> = Record<string, unknown>,
> =
  | RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
  | AsyncableRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
  | ErrorRequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;

export const asyncHandler = <P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
  fn: AsyncableRequestHandler<P, ResBody, ReqBody, ReqQuery>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
