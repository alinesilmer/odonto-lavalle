import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthUser, LoginRequest, LoginResponse, PatientDto, RegisterRequest, Role } from "@odonto/shared";
import { AuthContext, type AuthState } from "./context";
import { authApi } from "../services";
import { sessionStore } from "../services/http";
import { DEMO_MODE, DEMO_PATIENT, demoUser, readDemoRole, writeDemoRole } from "./demoSession";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [patient, setPatient] = useState<PatientDto | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((res: LoginResponse) => {
    sessionStore.write({
      token: res.token,
      refreshToken: res.refreshToken,
      expiresAt: Date.now() + res.expiresIn * 1000,
    });
    setUser(res.user);
    return res.user;
  }, []);

  const refreshProfile = useCallback(async () => {
    const { user: me, patient: profile } = await authApi.me();
    setUser(me);
    setPatient(profile ?? null);
  }, []);

  // On boot, a stored token is only trusted after the server confirms it.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const demoRole = DEMO_MODE ? readDemoRole() : null;
      if (DEMO_MODE && demoRole) {
        setUser(demoUser(demoRole));
        setPatient(demoRole === "patient" ? DEMO_PATIENT : null);
        setLoading(false);
        return;
      }
      if (!sessionStore.read()) {
        setLoading(false);
        return;
      }
      try {
        const { user: me, patient: profile } = await authApi.me();
        if (cancelled) return;
        setUser(me);
        setPatient(profile ?? null);
      } catch {
        if (!cancelled) sessionStore.clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (body: LoginRequest) => {
      const res = await authApi.login(body);
      const me = applySession(res);
      await refreshProfile().catch(() => undefined);
      return me;
    },
    [applySession, refreshProfile],
  );

  const register = useCallback(
    async (body: RegisterRequest) => {
      const res = await authApi.register(body);
      const me = applySession(res);
      await refreshProfile().catch(() => undefined);
      return me;
    },
    [applySession, refreshProfile],
  );

  const loginAsDemo = useCallback((role: Role) => {
    if (!DEMO_MODE) throw new Error("El modo demo solo funciona en desarrollo");
    writeDemoRole(role);
    const me = demoUser(role);
    setUser(me);
    setPatient(role === "patient" ? DEMO_PATIENT : null);
    return me;
  }, []);

  const logout = useCallback(async () => {
    if (DEMO_MODE && readDemoRole()) {
      writeDemoRole(null);
      setUser(null);
      setPatient(null);
      return;
    }
    // Best-effort server revoke; the local session is cleared either way.
    await authApi.logout().catch(() => undefined);
    sessionStore.clear();
    setUser(null);
    setPatient(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, patient, loading, login, register, logout, refreshProfile, loginAsDemo }),
    [user, patient, loading, login, register, logout, refreshProfile, loginAsDemo],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
