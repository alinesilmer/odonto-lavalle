import { Award, BadgeCheck, Feather, HandCoins, HeartHandshake, Smile, UserCheck, Users } from "lucide-react";
import { CLINIC_PHOTOS } from "./clinicPhotos";

export const MISSION_POINTS = [
  { icon: UserCheck, text: "Atención personalizada y profesional" },
  { icon: BadgeCheck, text: "Materiales y atención de calidad" },
  { icon: Feather, text: "Tratamientos sin dolor" },
  { icon: HandCoins, text: "Planes de financiación accesibles" },
];

export const VALUES = [
  {
    icon: HeartHandshake,
    title: "Cuidado personalizado",
    description: "Cada paciente es único y merece atención individualizada.",
  },
  {
    icon: Award,
    title: "Excelencia profesional",
    description: "Equipo altamente capacitado y comprometido con la calidad en cada tratamiento.",
  },
  {
    icon: Users,
    title: "Enfoque familiar",
    description: "Odontología para todas las edades en un ambiente cálido.",
  },
  {
    icon: Smile,
    title: "Compromiso con tu sonrisa",
    description: "Comprometidos con tu salud bucal y con resultados que duren.",
  },
];

export const TEAM = [
  {
    name: "Od. Paula Cavaglia",
    role: "Odontóloga general",
    image: CLINIC_PHOTOS.paula,
    specialties: ["Estética dental", "Rehabilitación oral"],
  },
  {
    name: "Od. Florencia Hernández",
    role: "Endodoncista",
    image: CLINIC_PHOTOS.florencia,
    specialties: ["Tratamientos de conducto", "Ortodoncia"],
  },
];
