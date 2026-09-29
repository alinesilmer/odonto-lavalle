import { TOOTH_STATUSES, type TabId, type TimelineStatus, type ToothGroup, type ToothStatus } from "./types";

interface ToothStatusInfo {
  label: string;
  /** Short mark drawn on the tooth; empty for a healthy one. */
  code: string;
  group: ToothGroup;
}

export const TOOTH_STATUS_INFO: Record<ToothStatus, ToothStatusInfo> = {
  sano: { label: "Sano", code: "", group: "healthy" },
  caries: { label: "Caries", code: "C", group: "pending" },
  fractura: { label: "Fractura", code: "F", group: "pending" },
  extraccion: { label: "Extracción indicada", code: "X", group: "pending" },
  obturacion: { label: "Obturación", code: "O", group: "done" },
  sellante: { label: "Sellante", code: "S", group: "done" },
  endodoncia: { label: "Endodoncia", code: "E", group: "done" },
  tratamiento: { label: "En tratamiento", code: "T", group: "treatment" },
  corona: { label: "Corona", code: "Co", group: "prosthetic" },
  carilla: { label: "Carilla", code: "Ca", group: "prosthetic" },
  puente: { label: "Pilar de puente", code: "P", group: "prosthetic" },
  implante: { label: "Implante", code: "I", group: "prosthetic" },
  ausente: { label: "Ausente", code: "A", group: "absent" },
};

export const TOOTH_STATUS_LABEL = Object.fromEntries(
  TOOTH_STATUSES.map((status) => [status, TOOTH_STATUS_INFO[status].label]),
) as Record<ToothStatus, string>;

export const TOOTH_GROUP_LABEL: Record<ToothGroup, string> = {
  healthy: "Sano",
  pending: "Patología / pendiente",
  done: "Tratamiento realizado",
  treatment: "En tratamiento",
  prosthetic: "Prótesis",
  absent: "Ausente",
};

/** States listed under their group, for the legend and the state picker. */
export const TOOTH_STATUSES_BY_GROUP = (Object.keys(TOOTH_GROUP_LABEL) as ToothGroup[]).map((group) => ({
  group,
  statuses: TOOTH_STATUSES.filter((status) => TOOTH_STATUS_INFO[status].group === group),
}));

const TOOTH_KIND = [
  "incisivo central",
  "incisivo lateral",
  "canino",
  "primer premolar",
  "segundo premolar",
  "primer molar",
  "segundo molar",
  "tercer molar",
];

const QUADRANT = ["superior derecho", "superior izquierdo", "inferior izquierdo", "inferior derecho"];

/** FDI number → its name: 16 → "Primer molar superior derecho". */
export function toothName(number: number): string {
  const kind = TOOTH_KIND[(number % 10) - 1];
  const quadrant = QUADRANT[Math.floor(number / 10) - 1];
  if (!kind || !quadrant) return `Pieza ${number}`;
  return `${kind.charAt(0).toUpperCase()}${kind.slice(1)} ${quadrant}`;
}

export const TIMELINE_STATUS_LABEL: Record<TimelineStatus, string> = {
  scheduled: "Programado",
  "in-progress": "En progreso",
  completed: "Completado",
};

export const TAB_LABEL: Record<TabId, string> = {
  overview: "Resumen",
  timeline: "Evolución",
  appointments: "Visitas",
  files: "Archivos",
};
