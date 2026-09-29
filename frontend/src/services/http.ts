import type { ApiError, LoginResponse } from "@odonto/shared";
import { DEMO_MODE, readDemoRole } from "@/auth/demoSession";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "/api";

const TOKEN_KEY = "odonto.auth";

export interface StoredSession {
  token: string;
  refreshToken: string;
  /** Epoch ms at which `token` stops being accepted. */
  expiresAt: number;
}

export const sessionStore = {
  read(): StoredSession | null {
    try {
      const raw = localStorage.getItem(TOKEN_KEY);
      return raw ? (JSON.parse(raw) as StoredSession) : null;
    } catch {
      return null;
    }
  },
  write(session: StoredSession) {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(session));
    } catch {
      /* private mode; the session just won't survive a reload */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

/** Thrown for any non-2xx response, carrying the server's field-level details. */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, string>;

  constructor(status: number, code: string, message: string, details?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let refreshInFlight: Promise<StoredSession | null> | null = null;

/** Refreshes the ID token, de-duplicating concurrent 401s into one round-trip. */
async function refreshSession(): Promise<StoredSession | null> {
  refreshInFlight ??= (async () => {
    const current = sessionStore.read();
    if (!current?.refreshToken) return null;

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (!res.ok) {
      sessionStore.clear();
      return null;
    }

    const data = (await res.json()) as LoginResponse;
    const next: StoredSession = {
      token: data.token,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn * 1000,
    };
    sessionStore.write(next);
    return next;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip the Authorization header (public endpoints). */
  anonymous?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, anonymous, headers, ...init } = options;

  // Demo sessions (development only) are answered in the browser; production drops this branch.
  if (DEMO_MODE && readDemoRole()) {
    const { handleDemoRequest } = await import("./demo/demoApi");
    return handleDemoRequest<T>(init.method ?? "GET", path, body);
  }

  // A File/Blob (an upload) goes as-is with its own type; anything else as JSON.
  const raw = body instanceof Blob;
  const send = async (token?: string) => {
    const finalHeaders = new Headers(headers);
    if (raw) finalHeaders.set("Content-Type", body.type || "application/octet-stream");
    else if (body !== undefined) finalHeaders.set("Content-Type", "application/json");
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

    return fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: finalHeaders,
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    });
  };

  let session = anonymous ? null : sessionStore.read();

  // Refresh proactively when the token is within 30s of expiring.
  if (session && session.expiresAt - Date.now() < 30_000) {
    session = await refreshSession();
  }

  let res = await send(session?.token);

  // One retry after a refresh covers a token that expired mid-flight.
  if (res.status === 401 && !anonymous) {
    const refreshed = await refreshSession();
    if (refreshed) res = await send(refreshed.token);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    const err = (payload as ApiError | null)?.error;
    throw new ApiRequestError(
      res.status,
      err?.code ?? "unknown",
      err?.message ?? "No pudimos conectar con el servidor",
      err?.details,
    );
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
