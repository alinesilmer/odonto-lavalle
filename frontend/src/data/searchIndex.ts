/** What the site-wide search can find. Static; the site has no search backend. */
import { ROUTES } from "@/constants";
import type { SearchItem } from "@/components/SearchModal/types";

export const SEARCH_SUGGESTIONS = ["Limpieza", "Ortodoncia", "Implantes", "Turno"];

export const SEARCH_INDEX: SearchItem[] = [
  {
    title: "Limpieza profesional",
    description: "Profilaxis y pulido para prevenir caries y gingivitis.",
    url: ROUTES.services,
    category: "Servicio",
    icon: "tooth",
    keywords: ["higiene", "profilaxis", "placa", "sarro"],
  },
  {
    title: "Ortodoncia",
    description: "Alineadores y brackets para corregir la mordida.",
    url: ROUTES.services,
    category: "Servicio",
    icon: "stethoscope",
    keywords: ["alineadores", "brackets", "mordida"],
  },
  {
    title: "Blanqueamiento dental",
    description: "Tratamiento estético para una sonrisa más luminosa.",
    url: ROUTES.services,
    category: "Servicio",
    icon: "tooth",
    keywords: ["estética", "manchas", "color"],
  },
  {
    title: "Implantes",
    description: "Reemplazo de piezas ausentes con implantes dentales.",
    url: ROUTES.services,
    category: "Servicio",
    icon: "stethoscope",
    keywords: ["implante", "prótesis"],
  },
  {
    title: "Solicitar turno",
    description: "Reservá tu consulta en minutos.",
    url: ROUTES.booking,
    category: "Turnos",
    icon: "calendar",
    keywords: ["agenda", "reserva", "cita"],
  },
  {
    title: "Urgencias y contacto",
    description: "Teléfono, WhatsApp, ubicación y horarios.",
    url: ROUTES.contact,
    category: "Contacto",
    icon: "phone",
    keywords: ["urgencia", "llamar", "ubicación"],
  },
  {
    title: "Nosotros",
    description: "Equipo, filosofía y tecnología del consultorio.",
    url: ROUTES.about,
    category: "Nosotros",
    icon: "info",
    keywords: ["equipo", "tecnología", "filosofía"],
  },
  {
    title: "Área paciente",
    description: "Ingresá a tu panel para ver tus turnos y tu historia clínica.",
    url: ROUTES.patient.home,
    category: "Paciente",
    icon: "info",
    keywords: ["panel", "historia", "turnos"],
  },
];
