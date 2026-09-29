import type { AuthUser, PatientDto, Role } from "@odonto/shared";

/**
 * Demo sign-in for working on the dashboards without the backend.
 *
 * Only ever on in `npm run dev` with VITE_DEMO_AUTH=true (set it in the
 * git-ignored frontend/.env.development.local). Production builds compile
 * this to `false`, so the demo buttons and session can never ship.
 */
export const DEMO_MODE = import.meta.env.DEV && import.meta.env.VITE_DEMO_AUTH === "true";

const STORAGE_KEY = "lavalle.demoRole";

const DEMO_USERS: Record<Role, AuthUser> = {
  admin: { uid: "demo-admin", email: "admin@demo.local", fullName: "Admin Demo", role: "admin" },
  patient: { uid: "demo-patient", email: "paciente@demo.local", fullName: "Paciente Demo", role: "patient" },
};

const now = new Date().toISOString();

export const DEMO_PATIENT: PatientDto = {
  id: "demo-patient",
  uid: "demo-patient",
  fullName: "Paciente Demo",
  dni: "30000000",
  gender: "otro",
  email: "paciente@demo.local",
  phone: "3794000000",
  birthDate: "1990-01-01",
  insurance: "galeno",
  status: "active",
  createdAt: now,
  updatedAt: now,
};

export const demoUser = (role: Role): AuthUser => DEMO_USERS[role];

/** The role signed in this tab, if any; sessionStorage so it ends with the tab. */
export function readDemoRole(): Role | null {
  if (!DEMO_MODE) return null;
  try {
    const role = sessionStorage.getItem(STORAGE_KEY);
    return role === "admin" || role === "patient" ? role : null;
  } catch {
    return null;
  }
}

export function writeDemoRole(role: Role | null): void {
  try {
    if (role) sessionStorage.setItem(STORAGE_KEY, role);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the demo session simply lasts until reload.
  }
}
