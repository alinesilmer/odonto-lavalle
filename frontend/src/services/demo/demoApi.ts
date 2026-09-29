import type {
  AppointmentDto,
  CreateHistoryRecordRequest,
  HistoryRecordDto,
  TreatmentDto,
  UpdateTreatmentRequest,
  ReminderDto,
  UpsertReminderRequest,
  CreateAppointmentRequest,
  StatsChartsDto,
  StatsSummaryDto,
  UpdateAppointmentRequest,
} from "@odonto/shared";
import { DEMO_PATIENT, demoUser, readDemoRole } from "@/auth/demoSession";
import { clinicMonthOf, clinicToday, clinicYearOf, toApiTimestamp, toFormFields } from "@/utils/clinicTime";
import { normalizeText } from "@/utils/text";
import { ApiRequestError } from "../http";
import {
  DEMO_PATIENTS,
  buildDemoAppointments,
  buildDemoHistory,
  buildDemoReminders,
  buildDemoTreatment,
} from "./demoFixtures";
import { DEMO_HANDLERS, NOT_MINE, lowStockCount } from "./demoHandlers";

/**
 * Answers API calls in the browser while a demo session is active, so the
 * dashboards work without the backend. Writes change this in-memory copy
 * only and are lost on reload. Development only (see auth/demoSession).
 */

let appointments: AppointmentDto[] = buildDemoAppointments();
let reminders: ReminderDto[] = buildDemoReminders();
const treatments: Record<string, TreatmentDto> = {};
const histories: Record<string, HistoryRecordDto[]> = {};

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const delay = () => new Promise((resolve) => setTimeout(resolve, 250));

/** The clinic-local calendar day of an instant, "2026-09-29". */
const isoDay = (iso: string) => toFormFields(iso).date;

function summary(): StatsSummaryDto {
  const today = clinicToday();
  const [year, month] = today.split("-").map(Number);
  const live = appointments.filter((a) => a.status !== "cancelled");
  return {
    appointmentsToday: live.filter((a) => isoDay(a.startsAt) === today).length,
    appointmentsThisMonth: live.filter(
      (a) => clinicYearOf(a.startsAt) === year && clinicMonthOf(a.startsAt) === month,
    ).length,
    activePatients: DEMO_PATIENTS.filter((p) => p.status === "active").length,
    lowStockItems: lowStockCount(),
  };
}

function charts(): StatsChartsDto {
  const month = Number(clinicToday().split("-")[1]);
  // Like the API: every month of the current year, January first.
  const byMonth = MONTHS.map((label, i) => {
    const m = i + 1;
    const value =
      m === month
        ? appointments.filter((a) => clinicMonthOf(a.startsAt) === month).length
        : m < month
          ? 38 + ((m * 7) % 17)
          : 0;
    return { label, value };
  });

  const count = (key: (a: AppointmentDto) => string) => {
    const map = new Map<string, number>();
    appointments.forEach((a) => map.set(key(a), (map.get(key(a)) ?? 0) + 1));
    return [...map].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  };

  return {
    appointmentsByMonth: byMonth,
    appointmentsByStatus: count((a) => a.status),
    topReasons: count((a) => a.reason).slice(0, 5),
  };
}

function page<T>(items: T[], query: URLSearchParams) {
  const pageSize = Number(query.get("pageSize") ?? 20);
  const current = Number(query.get("page") ?? 1);
  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    total: items.length,
    page: current,
    pageSize,
  };
}

function findAppointment(id: string) {
  const found = appointments.find((a) => a.id === id);
  if (!found) throw new ApiRequestError(404, "not_found", "El turno no existe");
  return found;
}

export async function handleDemoRequest<T>(method: string, path: string, body: unknown): Promise<T> {
  await delay();
  const url = new URL(path, "http://demo.local");
  const route = url.pathname;
  const query = url.searchParams;
  const role = readDemoRole() ?? "patient";

  const respond = (value: unknown) => value as T;

  if (method === "GET" && route === "/auth/me") {
    return respond({ user: demoUser(role), patient: role === "patient" ? DEMO_PATIENT : undefined });
  }
  if (method === "POST" && route === "/auth/logout") return respond(undefined);

  for (const handle of DEMO_HANDLERS) {
    const answer = handle(method, route, body);
    if (answer !== NOT_MINE) return respond(answer);
  }

  if (route === "/stats/summary") return respond(summary());
  if (route === "/stats/charts") return respond(charts());

  if (route === "/appointments") {
    if (method === "GET") {
      const status = query.get("status");
      const mine = role === "patient" ? appointments.filter((a) => a.patientId === DEMO_PATIENTS[0].id) : appointments;
      const list = (status ? mine.filter((a) => a.status === status) : mine)
        .slice()
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
      return respond(page(list, query));
    }
    if (method === "POST") {
      const req = body as CreateAppointmentRequest;
      const patient = DEMO_PATIENTS.find((p) => p.id === req.patientId) ?? DEMO_PATIENTS[0];
      const now = new Date().toISOString();
      const created: AppointmentDto = {
        id: `demo-a${Date.now()}`,
        patientId: patient.id,
        patientName: patient.fullName,
        startsAt: req.startsAt,
        durationMinutes: 30,
        reason: req.reason,
        insurance: patient.insurance,
        status: "pending",
        paymentStatus: "pending",
        notes: req.notes,
        createdAt: now,
        updatedAt: now,
      };
      appointments = [...appointments, created];
      return respond(created);
    }
  }

  const appointmentMatch = route.match(/^\/appointments\/([^/]+)$/);
  if (appointmentMatch && appointmentMatch[1] !== "availability") {
    const id = appointmentMatch[1];
    if (method === "DELETE") {
      findAppointment(id);
      appointments = appointments.filter((a) => a.id !== id);
      return respond(undefined);
    }
    if (method === "PATCH") {
      const updated = { ...findAppointment(id), ...(body as UpdateAppointmentRequest), updatedAt: new Date().toISOString() };
      appointments = appointments.map((a) => (a.id === id ? updated : a));
      return respond(updated);
    }
  }

  if (route === "/appointments/availability") {
    const date = query.get("date") ?? clinicToday();
    const taken = new Set(appointments.filter((a) => isoDay(a.startsAt) === date).map((a) => a.startsAt));
    const slots = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00"].filter(
      (time) => !taken.has(toApiTimestamp(date, time)),
    );
    return respond({ date, slots });
  }

  const patientRecord = route.match(/^\/patients\/([^/]+)\/(treatment|history)$/);
  if (patientRecord) {
    const [, id, kind] = patientRecord;
    const patient = DEMO_PATIENTS.find((p) => p.id === id) ?? { ...DEMO_PATIENTS[0], id, fullName: DEMO_PATIENT.fullName };
    if (kind === "treatment") {
      treatments[id] ??= buildDemoTreatment(patient);
      if (method === "PUT") treatments[id] = { ...treatments[id], ...(body as UpdateTreatmentRequest) };
      return respond(method === "PUT" ? undefined : treatments[id]);
    }
    histories[id] ??= buildDemoHistory(id);
    if (method === "POST") {
      const created: HistoryRecordDto = {
        id: `demo-h${Date.now()}`,
        patientId: id,
        documents: [],
        createdBy: "demo-admin",
        createdAt: new Date().toISOString(),
        ...(body as CreateHistoryRecordRequest),
      };
      histories[id] = [created, ...histories[id]];
      return respond(created);
    }
    return respond({ items: histories[id] });
  }

  if (method === "POST" && route === "/patients") {
    const now = new Date().toISOString();
    const created = { ...(body as object), id: `demo-p${Date.now()}`, uid: "", status: "active", createdAt: now, updatedAt: now };
    DEMO_PATIENTS.push(created as (typeof DEMO_PATIENTS)[number]);
    return respond(created);
  }
  if (method === "GET" && route === "/patients") {
    const term = normalizeText(query.get("search") ?? "");
    const list = term
      ? DEMO_PATIENTS.filter((p) => normalizeText(`${p.fullName} ${p.dni}`).includes(term))
      : DEMO_PATIENTS;
    return respond(page(list, query));
  }
  const patientMatch = route.match(/^\/patients\/([^/]+)$/);
  if (method === "GET" && patientMatch) {
    const patient = DEMO_PATIENTS.find((p) => p.id === patientMatch[1]) ?? DEMO_PATIENT;
    return respond(patient);
  }

  if (route === "/reminders") {
    if (method === "GET") return respond({ items: reminders });
    if (method === "POST") {
      const created: ReminderDto = { id: `demo-r${Date.now()}`, createdAt: new Date().toISOString(), ...(body as UpsertReminderRequest) };
      reminders = [...reminders, created];
      return respond(created);
    }
  }
  const reminderMatch = route.match(/^\/reminders\/([^/]+)$/);
  if (reminderMatch) {
    const id = reminderMatch[1];
    if (method === "DELETE") {
      reminders = reminders.filter((r) => r.id !== id);
      return respond(undefined);
    }
    if (method === "PATCH") {
      reminders = reminders.map((r) => (r.id === id ? { ...r, ...(body as Partial<UpsertReminderRequest>) } : r));
      return respond(reminders.find((r) => r.id === id));
    }
  }

  // Everything else: empty lists for reads, the request echoed back for writes.
  if (method === "GET") return respond({ items: [] });
  if (method === "DELETE") return respond(undefined);
  return respond({ id: `demo-${Date.now()}`, ...(body as object) });
}
