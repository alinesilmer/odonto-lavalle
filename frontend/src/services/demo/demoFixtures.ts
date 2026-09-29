import type {
  AppointmentDto,
  AppointmentStatus,
  HistoryRecordDto,
  Insurance,
  PatientDto,
  ReminderDto,
  TreatmentDto,
} from "@odonto/shared";
import { toIsoDate } from "@/utils/date";
import { clinicTodayDate, toApiTimestamp } from "@/utils/clinicTime";
import { initialPlannedAppointments, initialProgress, initialTimeline, initialToothChart } from "./demoTreatment";

/**
 * Invented sample data for demo mode (development only, see auth/demoSession).
 * Dates are generated around today so the dashboards always look current.
 */

const NAMES: Array<[string, Insurance]> = [
  ["Lucía Fernández", "galeno"],
  ["Martín Gómez", "swiss"],
  ["Sofía Romero", "sancor"],
  ["Juan Pablo Díaz", "ninguna"],
  ["Valentina Acosta", "medife"],
  ["Tomás Benítez", "ospim"],
  ["Camila Sosa", "issunne"],
  ["Nicolás Ramírez", "ospjn"],
  ["Julieta Molina", "galeno"],
  ["Federico Ortiz", "otro"],
];

const REASONS = [
  "Consulta",
  "Limpieza",
  "Control",
  "Blanqueamiento",
  "Tratamiento de conducto",
  "Extracción",
  "Alineadores",
  "Arreglo de caries",
];

const TIMES = ["09:00", "09:30", "10:30", "11:00", "12:00", "15:00", "16:30", "17:00", "18:30"];

/** Deterministic pseudo-random, so the demo looks the same on every reload. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const stamp = new Date().toISOString();

export const DEMO_PATIENTS: PatientDto[] = NAMES.map(([fullName, insurance], i) => ({
  id: `demo-p${i + 1}`,
  uid: `demo-p${i + 1}`,
  fullName,
  dni: String(30_100_000 + i * 734_517),
  gender: i % 2 === 0 ? "femenino" : "masculino",
  email: `${fullName.split(" ")[0].toLowerCase()}@demo.local`,
  phone: `3794${String(100_000 + i * 7_331).slice(0, 6)}`,
  birthDate: `${1970 + ((i * 7) % 35)}-0${(i % 9) + 1}-1${i % 9}`,
  insurance,
  status: i === 9 ? "inactive" : "active",
  createdAt: stamp,
  updatedAt: stamp,
}));

function statusFor(offset: number, roll: number): AppointmentStatus {
  if (offset < 0) return roll < 0.85 ? "completed" : "cancelled";
  if (offset === 0) return roll < 0.6 ? "confirmed" : "pending";
  return roll < 0.45 ? "confirmed" : roll < 0.93 ? "pending" : "cancelled";
}

export function buildDemoAppointments(): AppointmentDto[] {
  const random = seeded(42);
  const today = clinicTodayDate();
  const items: AppointmentDto[] = [];

  for (let offset = -20; offset <= 21; offset++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    if (day.getDay() === 0) continue; // closed on Sundays
    const count = offset === 0 ? 5 : Math.floor(random() * 4);
    const times = [...TIMES].sort(() => random() - 0.5).slice(0, count).sort();

    times.forEach((time) => {
      const patient = DEMO_PATIENTS[Math.floor(random() * DEMO_PATIENTS.length)];
      const status = statusFor(offset, random());
      items.push({
        id: `demo-a${items.length + 1}`,
        patientId: patient.id,
        patientName: patient.fullName,
        startsAt: toApiTimestamp(toIsoDate(day), time),
        durationMinutes: 30,
        reason: REASONS[Math.floor(random() * REASONS.length)],
        insurance: patient.insurance,
        status,
        paymentStatus: status === "completed" ? "paid" : "pending",
        createdAt: stamp,
        updatedAt: stamp,
      });
    });
  }

  return items;
}

const REMINDERS: Array<[number, string, string, boolean]> = [
  [-2, "Pedir insumos de anestesia", "Quedan pocas unidades de lidocaína.", false],
  [0, "Llamar a Lucía Fernández", "Confirmar el control post-tratamiento.", false],
  [0, "Revisar autoclave", "Mantenimiento mensual del equipo.", true],
  [2, "Enviar presupuesto", "Presupuesto de alineadores para Martín Gómez.", false],
  [5, "Renovar convenio con Galeno", "El convenio vence a fin de mes.", false],
  [12, "Capacitación de radiografía digital", "Curso online, 2 horas.", false],
  [-6, "Pagar alquiler del consultorio", "Transferencia mensual.", true],
];

export function buildDemoReminders(): ReminderDto[] {
  const today = clinicTodayDate();
  return REMINDERS.map(([offset, title, description, done], i) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    return {
      id: `demo-r${i + 1}`,
      title,
      description,
      dueAt: toApiTimestamp(toIsoDate(day), "10:00"),
      done,
      createdAt: stamp,
    };
  });
}

export function buildDemoTreatment(patient: PatientDto): TreatmentDto {
  return {
    patientId: patient.id,
    patientName: patient.fullName,
    dni: patient.dni,
    gender: patient.gender,
    age: 34,
    conditions: [
      { name: "Bruxismo", diagnosis: "Desgaste leve en molares", date: "2025-11-04" },
      { name: "Gingivitis", diagnosis: "Inflamación localizada, en control", date: "2026-03-18" },
    ],
    medications: [{ name: "Ibuprofeno 400 mg", dosage: "Cada 8 h durante 3 días, si hay dolor" }],
    teeth: initialToothChart,
    timeline: initialTimeline,
    plannedVisits: initialPlannedAppointments,
    progress: initialProgress,
    updatedAt: stamp,
  };
}

export function buildDemoHistory(patientId: string): HistoryRecordDto[] {
  const rows: Array<[string, string, string, string, string[]]> = [
    ["2026-08-12", "Control y limpieza", "Sin caries nuevas", "Se recomienda control en 6 meses.", ["radiografia-agosto.pdf"]],
    ["2026-05-20", "Empaste pieza 16", "Caries oclusal", "Resina compuesta, color A2.", []],
    ["2026-03-18", "Consulta por sangrado de encías", "Gingivitis localizada", "Indicación de cepillado y enjuague.", []],
    ["2025-11-04", "Primera consulta", "Bruxismo", "Se sugiere placa de descanso nocturna.", ["odontograma-inicial.pdf"]],
  ];
  return rows.map(([date, title, diagnosis, notes, docs], i) => ({
    id: `demo-h${i + 1}`,
    patientId,
    date,
    title,
    diagnosis,
    notes,
    documents: docs.map((name, d) => ({
      id: `demo-d${i}-${d}`,
      name,
      url: "#",
      contentType: "application/pdf",
      sizeBytes: 120_000,
      uploadedAt: stamp,
    })),
    createdBy: "demo-admin",
    createdAt: stamp,
  }));
}
