import { createContext } from "react";
import type { AuthUser, LoginRequest, PatientDto, RegisterRequest, Role } from "@odonto/shared";

export interface AuthState {
  user: AuthUser | null;
  patient: PatientDto | null;
  /** True until the stored session has been checked against the server. */
  loading: boolean;
  login: (body: LoginRequest) => Promise<AuthUser>;
  register: (body: RegisterRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  /** Development only (see demoSession.ts): sign in as a fake user, no server. */
  loginAsDemo: (role: Role) => AuthUser;
}

/**
 * Lives apart from AuthProvider so that file exports only components —
 * react-refresh cannot fast-refresh a module that mixes the two.
 */
export const AuthContext = createContext<AuthState | null>(null);
