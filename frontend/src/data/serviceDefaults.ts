/** Fallback copy for a service that carries no details of its own. */
import type { ResolvedDetails, ServiceDetails } from "@/components/MoreInfoModal/types";

export const DEFAULT_SERVICE_DETAILS: ResolvedDetails = {
  benefits: [
    "Previene caries y enfermedad periodontal con limpiezas regulares.",
    "Detecta problemas a tiempo y reduce tratamientos costosos.",
    "Mejora el aliento y la estética del esmalte.",
  ],
  steps: [
    "Evaluación clínica y conversación breve sobre tu historia odontológica.",
    "Profilaxis: remoción de placa y sarro con instrumental específico.",
    "Pulido y recomendaciones personalizadas según tu caso.",
  ],
  care: [
    "Cepillado 2–3 veces al día con técnica adecuada.",
    "Uso de hilo dental o irrigadores diariamente.",
    "Evitar tabaco y exceso de bebidas azucaradas.",
  ],
  faqs: [
    {
      q: "¿Cada cuánto debo venir?",
      a: "Generalmente cada 6 meses; algunos casos requieren controles más frecuentes.",
    },
    {
      q: "¿Duele la limpieza?",
      a: "No debería doler; puede haber sensibilidad leve y transitoria.",
    },
    {
      q: "¿Puedo comer luego?",
      a: "Sí; si hubo flúor tópico, evitá comer por 30 minutos.",
    },
  ],
};

export const DEFAULT_SERVICE_DESCRIPTION =
  "Chequeos periódicos y limpiezas profesionales ayudan a mantener una salud bucal óptima y a prevenir patologías frecuentes. Conocé cómo trabajamos y por qué una visita programada puede ahorrarte tratamientos complejos.";

/** Each section falls back independently, so partial details still work. */
export function resolveServiceDetails(details?: ServiceDetails): ResolvedDetails {
  return {
    benefits: details?.benefits?.length ? details.benefits : DEFAULT_SERVICE_DETAILS.benefits,
    steps: details?.steps?.length ? details.steps : DEFAULT_SERVICE_DETAILS.steps,
    care: details?.care?.length ? details.care : DEFAULT_SERVICE_DETAILS.care,
    faqs: details?.faqs?.length ? details.faqs : DEFAULT_SERVICE_DETAILS.faqs,
  };
}
