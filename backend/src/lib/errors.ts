export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const badRequest = (message: string, details?: Record<string, string>) =>
  new HttpError(400, "bad_request", message, details);
export const unauthorized = (message = "No autenticado") =>
  new HttpError(401, "unauthorized", message);
export const forbidden = (message = "No tenés permiso para hacer esto") =>
  new HttpError(403, "forbidden", message);
export const notFound = (message = "Recurso no encontrado") =>
  new HttpError(404, "not_found", message);
export const conflict = (message: string, details?: Record<string, string>) =>
  new HttpError(409, "conflict", message, details);

/**
 * Express 5 types route params as `string | string[]` because a pattern can
 * repeat. Ours never do, so this narrows once instead of casting everywhere.
 */
export function param(params: Record<string, string | string[] | undefined>, name: string): string {
  const value = params[name];
  const single = Array.isArray(value) ? value[0] : value;
  if (!single) throw badRequest(`Falta el parámetro "${name}" en la URL`);
  return single;
}
