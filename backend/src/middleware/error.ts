import type { NextFunction, Request, Response } from "express";
import type { ApiError } from "@odonto/shared";
import { isProd } from "../config/env.js";
import { HttpError } from "../lib/errors.js";

export function notFoundHandler(_req: Request, res: Response) {
  const body: ApiError = { error: { code: "not_found", message: "Ruta no encontrada" } };
  res.status(404).json(body);
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const body: ApiError = {
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.status).json(body);
    return;
  }

  // Body-parser errors (malformed JSON, body too large) carry a 4xx status:
  // they're the client's mistake, not a server failure.
  const status = (err as { status?: number; type?: string } | null)?.status;
  if (typeof status === "number" && status >= 400 && status < 500) {
    const tooLarge = status === 413;
    const body: ApiError = {
      error: {
        code: tooLarge ? "too_large" : "bad_request",
        message: tooLarge ? "El contenido enviado es demasiado grande" : "La solicitud no es válida",
      },
    };
    res.status(status).json(body);
    return;
  }

  console.error("[unhandled]", err);
  const body: ApiError = {
    error: {
      code: "internal_error",
      message: isProd ? "Ocurrió un error inesperado" : String(err instanceof Error ? err.message : err),
    },
  };
  res.status(500).json(body);
}
