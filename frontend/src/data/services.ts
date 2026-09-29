import type { Service } from "../types"
import reason from "../assets/images/reasons.webp";
import reason2 from "../assets/images/reasons2.webp";
import reason3 from "../assets/images/reason3.webp";

export const services: Service[] = [
  {
    id: "1",
    title: "No esperes a sentir dolor",
    description: "Ningún dolor es normal. Una visita al odontólogo cada seis meses puede ahorrar tratos raros.",
    image: reason,
  },
  {
    id: "2",
    title: "Prevención",
    description: "No es necesario tener un plan de tratamiento para cuidar tu salud bucal: la prevención es tu mejor aliado.",
    image: reason2,
  },
  {
    id: "3",
    title: "Limpieza profesional",
    description:
      "Aunque mantengas una buena higiene bucal diaria, una limpieza profesional es clave para prevenir enfermedades.",
    image: reason3,
  },
]
