import { Router, RequestHandler } from 'express';
import { asyncHandler, AsyncableRequestHandler } from './asyncHandler';

export function AsyncRouter() {
  const router = Router();

  const methods = ['get', 'post', 'put', 'patch', 'delete', 'all'] as const;

  methods.forEach((method) => {
    const original = router[method].bind(router);

    function wrapped<P = unknown, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>(
      path: string,
      ...handlers: Array<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
    ) {
      const wrappedHandlers = handlers.map((h) => asyncHandler(h as AsyncableRequestHandler));

      return original(path, ...wrappedHandlers);
    }

    (router as typeof router)[method] = wrapped as typeof original;
  });

  return router;
}
