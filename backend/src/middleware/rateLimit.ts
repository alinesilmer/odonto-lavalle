import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "@odonto/shared";

interface Options {
  /** Requests allowed per window, per client IP. */
  max: number;
  windowMs: number;
  message: string;
}

/**
 * A fixed-window limiter kept in memory, keyed by client IP. Enough for one
 * API instance (the clinic's case); a multi-instance deploy would need a
 * shared store. Each limiter has its own counters, so limits don't mix.
 */
export function rateLimit({ max, windowMs, message }: Options) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  // Drop expired entries now and then so the map can't grow without bound.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, windowMs);
  sweep.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count <= max) return next();

    res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
    const body: ApiError = { error: { code: "too_many_requests", message } };
    res.status(429).json(body);
  };
}

const MINUTE = 60_000;

/** Login, sign-up, password reset: slows down password guessing. */
export const authLimiter = rateLimit({
  max: 10,
  windowMs: 15 * MINUTE,
  message: "Demasiados intentos. Esperá unos minutos y volvé a probar.",
});

/** Public forms (contact, newsletter, message): stops spam floods. */
export const publicFormLimiter = rateLimit({
  max: 5,
  windowMs: 10 * MINUTE,
  message: "Recibimos varios envíos seguidos. Probá de nuevo en unos minutos.",
});

/** Everything else: a generous ceiling that only stops runaway clients. */
export const apiLimiter = rateLimit({
  max: 600,
  windowMs: 5 * MINUTE,
  message: "Demasiadas solicitudes. Esperá un momento.",
});
