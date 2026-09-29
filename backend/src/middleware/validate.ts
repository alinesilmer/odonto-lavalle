import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { badRequest } from "../lib/errors.js";

type Source = "body" | "query" | "params";

/** Replaces req[source] with the parsed value, so handlers get typed, coerced input. */
export const validate =
  <T>(schema: ZodType<T>, source: Source = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details: Record<string, string> = {};
      for (const issue of result.error.issues) {
        details[issue.path.join(".") || "_"] = issue.message;
      }
      return next(badRequest("Los datos enviados no son válidos", details));
    }
    Object.defineProperty(req, source, { value: result.data, writable: true, configurable: true });
    next();
  };
