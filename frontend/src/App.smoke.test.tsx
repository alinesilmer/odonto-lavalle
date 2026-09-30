/**
 * Smoke test: renders every route of the real app (public and admin) with a
 * fake API and fails if any page throws while rendering. Unit tests and the
 * typecheck can't catch a page that compiles but crashes on screen.
 */
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { EMPTY_TREATMENT_PROGRESS, emptyToothChart } from "@odonto/shared";
import App from "./App";

const ADMIN = { uid: "admin-1", email: "admin@lavalle.com", fullName: "Admin", role: "admin" };
const PATIENT = {
  id: "p1", uid: "", fullName: "Aliné Silva", dni: "43747611", gender: "femenino", email: "",
  phone: "3794000000", birthDate: "1990-05-10", insurance: "Particular", status: "active",
  createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z",
};
const PAGE = { items: [], total: 0, page: 1, pageSize: 20 };

/** Answers like the real API, per path. */
function fakeApi(path: string): unknown {
  if (path.startsWith("/auth/me")) return { user: ADMIN };
  if (path.startsWith("/stats/summary")) return { appointmentsToday: 0, appointmentsThisMonth: 0, activePatients: 1, lowStockItems: 0 };
  if (path.startsWith("/stats/charts")) return { appointmentsByMonth: [], appointmentsByStatus: [], topReasons: [] };
  if (path.startsWith("/settings")) return { consultationPrice: 30000 };
  if (path.startsWith("/appointments/availability")) return { date: "2026-10-01", slots: ["09:00", "09:30"] };
  if (/^\/patients\/[^/]+\/treatment/.test(path)) {
    return {
      patientId: "p1", patientName: PATIENT.fullName, dni: PATIENT.dni, gender: "femenino", conditions: [], medications: [],
      teeth: emptyToothChart(), timeline: [], plannedVisits: [], progress: EMPTY_TREATMENT_PROGRESS, updatedAt: "",
    };
  }
  if (/^\/patients\/[^/]+\/(history|files)/.test(path)) return { items: [] };
  if (/^\/patients\/[^/]+(\?|$)/.test(path)) return PATIENT;
  if (path.startsWith("/patients")) return { ...PAGE, items: [PATIENT], total: 1 };
  if (path.startsWith("/appointments")) return PAGE;
  return { items: [] };
}

const errors: unknown[] = [];

beforeAll(() => {
  // What jsdom lacks and the app (or framer-motion) uses.
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("ResizeObserver", Observer);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false, media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  }));
  window.scrollTo = () => {};

  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = new URL(String(input), "http://localhost");
    const path = url.pathname.replace(/^.*\/api/, "") + url.search;
    return new Response(JSON.stringify(fakeApi(path)), { status: 200, headers: { "Content-Type": "application/json" } });
  });

  // A render crash surfaces as a console error / window error in React 19.
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (args.some((a) => a instanceof Error || /error occurred|Uncaught|is not defined/i.test(String(a)))) errors.push(args);
  });
  window.addEventListener("error", (e) => errors.push(e.error ?? e.message));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

afterAll(() => vi.unstubAllGlobals());

async function visit(path: string, { admin = false } = {}) {
  errors.length = 0;
  if (admin) {
    localStorage.setItem("odonto.auth", JSON.stringify({ token: "t", refreshToken: "r", expiresAt: Date.now() + 3_600_000 }));
  }
  window.history.pushState({}, "", path);
  const view = render(<App />);
  // Done when the page's content has replaced every loader.
  await waitFor(
    () => {
      const main = view.container.querySelector("main");
      expect(main?.children.length ?? 0).toBeGreaterThan(0);
      const loader = view.container.querySelector("main [role='status']");
      expect(loader, `still loading: "${loader?.textContent}"`).toBeNull();
    },
    { timeout: 8000 },
  );
  await act(async () => {});
  return view;
}

const PUBLIC = ["/", "/servicios", "/nosotros", "/contacto", "/turno", "/login", "/registro", "/no-existe"];
const ADMIN_PAGES = [
  "/dashboard/admin",
  "/dashboard/admin/turnos",
  "/dashboard/admin/pacientes",
  "/dashboard/admin/pacientes/p1/tratamiento",
  "/dashboard/admin/pacientes/p1/historia",
  "/dashboard/admin/stock",
  "/dashboard/admin/estadisticas",
  "/dashboard/admin/recordatorios",
  "/dashboard/admin/contenido",
  "/dashboard/admin/soporte",
  "/dashboard/admin/configuracion",
];

describe("every page renders without crashing", { timeout: 15_000 }, () => {
  it.each(PUBLIC)("public %s", async (path) => {
    await visit(path);
    expect(errors).toEqual([]);
  });

  it.each(ADMIN_PAGES)("admin %s", async (path) => {
    const view = await visit(path, { admin: true });
    expect(errors).toEqual([]);
    // Really inside the dashboard, not bounced to the login page.
    expect(window.location.pathname).toBe(path);
    expect(view.container.textContent).not.toContain("Bienvenido");
  });
});
