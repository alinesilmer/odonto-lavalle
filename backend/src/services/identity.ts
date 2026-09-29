import { env } from "../config/env.js";
import { HttpError, unauthorized } from "../lib/errors.js";

const IDENTITY = "https://identitytoolkit.googleapis.com/v1";
const SECURE_TOKEN = "https://securetoken.googleapis.com/v1";

/**
 * The Admin SDK can mint tokens but cannot check a password, so password sign-in
 * goes through Google's Identity Toolkit REST API. The web API key is safe to
 * hold server-side; it is not a secret, it only identifies the project.
 */
async function call<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    const code = json.error?.message ?? "UNKNOWN";
    throw mapIdentityError(code);
  }
  return json;
}

function mapIdentityError(code: string): HttpError {
  if (code.startsWith("EMAIL_NOT_FOUND") || code.startsWith("INVALID_PASSWORD") || code.startsWith("INVALID_LOGIN_CREDENTIALS")) {
    return unauthorized("Email o contraseña inválidos");
  }
  if (code.startsWith("USER_DISABLED")) {
    return new HttpError(403, "user_disabled", "Esta cuenta fue deshabilitada");
  }
  if (code.startsWith("TOO_MANY_ATTEMPTS")) {
    return new HttpError(429, "too_many_attempts", "Demasiados intentos. Probá de nuevo en unos minutos");
  }
  if (code.startsWith("TOKEN_EXPIRED") || code.startsWith("INVALID_REFRESH_TOKEN")) {
    return unauthorized("La sesión expiró. Iniciá sesión de nuevo");
  }
  return new HttpError(400, "identity_error", "No se pudo completar la operación");
}

export interface SignInResult {
  localId: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export const signInWithPassword = (email: string, password: string) =>
  call<SignInResult>(`${IDENTITY}/accounts:signInWithPassword?key=${env.FIREBASE_WEB_API_KEY}`, {
    email,
    password,
    returnSecureToken: true,
  });

export const refreshIdToken = (refreshToken: string) =>
  call<{ user_id: string; id_token: string; refresh_token: string; expires_in: string }>(
    `${SECURE_TOKEN}/token?key=${env.FIREBASE_WEB_API_KEY}`,
    { grant_type: "refresh_token", refresh_token: refreshToken },
  );

export const sendPasswordReset = (email: string) =>
  call<unknown>(`${IDENTITY}/accounts:sendOobCode?key=${env.FIREBASE_WEB_API_KEY}`, {
    requestType: "PASSWORD_RESET",
    email,
  });
