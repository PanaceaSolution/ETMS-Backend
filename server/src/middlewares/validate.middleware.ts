// validate.middleware.ts
import { RequestHandler } from 'express';
import { ZodType, ZodError, z } from 'zod';
import type { IncomingHttpHeaders } from 'http';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type SchemaSet = {
  body?: ZodType<any>;
  query?: ZodType<any>;
  params?: ZodType<any>;
  headers?: ZodType<any>;
  response?: ZodType<any>;
};

export type InferRequest<S extends SchemaSet> = {
  body: S['body'] extends ZodType<any> ? z.infer<S['body']> : unknown;
  query: S['query'] extends ZodType<any> ? z.infer<S['query']> : ParsedQs;
  params: S['params'] extends ZodType<any> ? z.infer<S['params']> : ParamsDictionary;
  headers: S['headers'] extends ZodType<any> ? z.infer<S['headers']> : IncomingHttpHeaders;
};

// Middleware generator ONLY
export function validate<S extends SchemaSet>(
  schemas: S,
): RequestHandler<
  InferRequest<S>['params'],
  unknown,
  InferRequest<S>['body'],
  InferRequest<S>['query']
> {
  return (req, res, next) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body) as InferRequest<S>['body'];
      if (schemas.query) req.query = schemas.query.parse(req.query) as InferRequest<S>['query'];
      if (schemas.params)
        req.params = schemas.params.parse(req.params) as InferRequest<S>['params'];
      if (schemas.headers)
        req.headers = schemas.headers.parse(req.headers) as InferRequest<S>['headers'];
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };
}
