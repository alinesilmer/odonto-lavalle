import type { NextFunction, Request, Response } from "express";
import type { Role } from "@odonto/shared";
import { auth } from "../config/firebase.js";
import { forbidden, unauthorized } from "../lib/errors.js";

export interface AuthedRequest extends Request {
  user: { uid: string; email: string; role: Role };
}

/**
 * Verifies the Firebase ID token in `Authorization: Bearer <token>` and puts the
 * caller on req.user. Role comes from a custom claim set at registration time,
 * so it cannot be spoofed by the client.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw unauthorized("Falta el token de autenticación");

    const decoded = await auth.verifyIdToken(header.slice(7), true);
    const role = (decoded.role as Role | undefined) ?? "patient";

    (req as AuthedRequest).user = { uid: decoded.uid, email: decoded.email ?? "", role };
    next();
  } catch (err) {
    if (err instanceof Error && err.name === "HttpError") return next(err);
    next(unauthorized("Sesión inválida o expirada"));
  }
}

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthedRequest).user;
    if (!user) return next(unauthorized());
    if (!roles.includes(user.role)) return next(forbidden());
    next();
  };

export const requireAdmin = requireRole("admin");

/** Patients may only touch their own records; admins may touch anyone's. */
export function assertCanAccessPatient(req: Request, patientId: string) {
  const user = (req as AuthedRequest).user;
  if (user.role === "admin") return;
  if (user.uid !== patientId) throw forbidden();
}
