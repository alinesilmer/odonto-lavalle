import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiRequestError, api, sessionStore } from "./http";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const validSession = () => ({
  token: "tok",
  refreshToken: "refresh",
  expiresAt: Date.now() + 60 * 60 * 1000,
});

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const authHeader = (call: unknown[]) =>
  (call[1] as RequestInit).headers instanceof Headers
    ? ((call[1] as RequestInit).headers as Headers).get("Authorization")
    : null;

describe("sessionStore", () => {
  it("round-trips a session through localStorage", () => {
    const s = validSession();
    sessionStore.write(s);
    expect(sessionStore.read()).toEqual(s);
  });

  it("returns null rather than throwing on corrupt stored data", () => {
    localStorage.setItem("odonto.auth", "{not json");
    expect(sessionStore.read()).toBeNull();
  });

  it("clears the stored session", () => {
    sessionStore.write(validSession());
    sessionStore.clear();
    expect(sessionStore.read()).toBeNull();
  });
});

describe("request", () => {
  it("attaches the bearer token when a session exists", async () => {
    sessionStore.write(validSession());
    fetchMock.mockResolvedValueOnce(json({ ok: true }));

    await api.get("/whatever");

    expect(authHeader(fetchMock.mock.calls[0])).toBe("Bearer tok");
  });

  it("omits the token on anonymous requests", async () => {
    sessionStore.write(validSession());
    fetchMock.mockResolvedValueOnce(json({ ok: true }));

    await api.post("/public/contact", { a: 1 }, { anonymous: true });

    expect(authHeader(fetchMock.mock.calls[0])).toBeNull();
  });

  it("returns undefined for a 204 instead of trying to parse a body", async () => {
    sessionStore.write(validSession());
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await expect(api.delete("/stock/1")).resolves.toBeUndefined();
  });

  it("throws ApiRequestError carrying the server's field details", async () => {
    fetchMock.mockResolvedValueOnce(
      json(
        {
          error: {
            code: "bad_request",
            message: "Los datos enviados no son válidos",
            details: { email: "Invalid email address" },
          },
        },
        400,
      ),
    );

    await expect(api.post("/auth/login", {}, { anonymous: true })).rejects.toMatchObject({
      name: "ApiRequestError",
      status: 400,
      code: "bad_request",
      details: { email: "Invalid email address" },
    });
  });

  it("refreshes a token that is about to expire, before sending", async () => {
    sessionStore.write({ ...validSession(), expiresAt: Date.now() + 5_000 });

    fetchMock
      .mockResolvedValueOnce(
        json({
          user: { uid: "u1", email: "a@b.com", fullName: "A", role: "patient" },
          token: "fresh",
          refreshToken: "refresh2",
          expiresIn: 3600,
        }),
      )
      .mockResolvedValueOnce(json({ ok: true }));

    await api.get("/appointments");

    expect(fetchMock.mock.calls[0][0]).toContain("/auth/refresh");
    expect(authHeader(fetchMock.mock.calls[1])).toBe("Bearer fresh");
    expect(sessionStore.read()?.token).toBe("fresh");
  });

  it("retries once with a fresh token after a 401", async () => {
    sessionStore.write(validSession());

    fetchMock
      .mockResolvedValueOnce(json({ error: { code: "unauthorized", message: "nope" } }, 401))
      .mockResolvedValueOnce(
        json({
          user: { uid: "u1", email: "a@b.com", fullName: "A", role: "patient" },
          token: "fresh",
          refreshToken: "refresh2",
          expiresIn: 3600,
        }),
      )
      .mockResolvedValueOnce(json({ ok: true }));

    await expect(api.get("/appointments")).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(authHeader(fetchMock.mock.calls[2])).toBe("Bearer fresh");
  });

  it("clears the session and surfaces the 401 when the refresh itself fails", async () => {
    sessionStore.write(validSession());

    fetchMock
      .mockResolvedValueOnce(json({ error: { code: "unauthorized", message: "nope" } }, 401))
      .mockResolvedValueOnce(json({ error: { code: "unauthorized", message: "no" } }, 401));

    await expect(api.get("/appointments")).rejects.toBeInstanceOf(ApiRequestError);
    expect(sessionStore.read()).toBeNull();
  });

  it("de-duplicates concurrent refreshes into a single round-trip", async () => {
    sessionStore.write({ ...validSession(), expiresAt: Date.now() + 5_000 });

    fetchMock.mockImplementation((url: string) => {
      if (String(url).includes("/auth/refresh")) {
        return Promise.resolve(
          json({
            user: { uid: "u1", email: "a@b.com", fullName: "A", role: "patient" },
            token: "fresh",
            refreshToken: "refresh2",
            expiresIn: 3600,
          }),
        );
      }
      return Promise.resolve(json({ ok: true }));
    });

    await Promise.all([api.get("/a"), api.get("/b"), api.get("/c")]);

    const refreshCalls = fetchMock.mock.calls.filter((c) =>
      String(c[0]).includes("/auth/refresh"),
    );
    expect(refreshCalls).toHaveLength(1);
  });
});
