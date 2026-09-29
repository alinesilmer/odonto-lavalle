import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 5 forwards rejected promises to the error middleware on its own, but
 * wrapping keeps the handler signatures inferable and the intent explicit.
 */
export const asyncHandler =
  <R extends Request>(fn: (req: R, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    void Promise.resolve(fn(req as R, res, next)).catch(next);
  };
