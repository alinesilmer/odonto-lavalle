/**
 * Sample odontogram, plan, visits and progress for demo patients (demo mode
 * only; real patients start from an empty record).
 */
import { FDI_NUMBERS, type PlannedAppointment, type TimelineEntry, type Tooth, type TreatmentProgressDto } from "@odonto/shared";

const SEEDED: Record<number, Pick<Tooth, "status" | "notes">> = {
  16: { status: "obturacion", notes: "Resina compuesta oclusal (mayo 2026)." },
  24: { status: "corona", notes: "Corona de porcelana; controlar ajuste." },
  36: { status: "caries", notes: "Caries mesial; programar obturación." },
  37: { status: "ausente", notes: "Extraída en 2019." },
  45: { status: "tratamiento", notes: "Tratamiento de conducto en curso, 2.ª sesión pendiente." },
  46: { status: "endodoncia", notes: "Endodoncia finalizada en 2024." },
  48: { status: "extraccion", notes: "Muela del juicio semi-incluida; derivar a cirugía." },
};

export const initialToothChart: Tooth[] = FDI_NUMBERS.map((number) => ({
  number,
  status: SEEDED[number]?.status ?? "sano",
  notes: SEEDED[number]?.notes ?? "",
}));

export const initialTimeline: TimelineEntry[] = [
  {
    date: "2024-01-15",
    title: "Consulta Inicial",
    status: "completed",
    description: "Examen oral completo",
  },
  {
    date: "2024-02-01",
    title: "Empaste Pieza #16",
    status: "completed",
    description: "Procedimiento de empaste compuesto",
  },
  {
    date: "2024-02-20",
    title: "Preparación Corona #24",
    status: "completed",
    description: "Preparación de corona y colocación temporal",
  },
  {
    date: "2024-03-10",
    title: "Colocación Corona #24",
    status: "in-progress",
    description: "Instalación de corona permanente",
  },
  {
    date: "2024-04-05",
    title: "Endodoncia #45",
    status: "scheduled",
    description: "Tratamiento endodóntico planificado",
  },
  {
    date: "2024-05-15",
    title: "Extracción #48",
    status: "scheduled",
    description: "Extracción de muela del juicio",
  },
];

export const initialPlannedAppointments: PlannedAppointment[] = [
  { date: "2024-03-10", time: "10:00", type: "Colocación de Corona", doctor: "Od. Hernández" },
  { date: "2024-04-05", time: "14:30", type: "Endodoncia", doctor: "Od. Cavaglia" },
  { date: "2024-05-15", time: "09:00", type: "Extracción", doctor: "Od. Cavaglia" },
];

export const initialProgress: TreatmentProgressDto = {
  completed: 8,
  total: 12,
  phasePercentage: 40,
  phaseLabel: "Procedimientos restaurativos en progreso",
};
