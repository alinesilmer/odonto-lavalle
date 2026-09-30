/**
 * Per-category selling points. Lookup tables, not logic — a category with no
 * entry falls back to `otros`.
 */
export interface CategoryContent {
  benefits: string[];
  features: string[];
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  estetica: {
    benefits: [
      "Mejora la apariencia de tu sonrisa",
      "Aumenta tu confianza y autoestima",
      "Resultados naturales y duraderos",
      "Procedimientos mínimamente invasivos",
    ],
    features: [
      "Evaluación completa de tu sonrisa",
      "Plan de tratamiento personalizado",
      "Materiales de alta calidad",
      "Garantía de satisfacción",
    ],
  },
  cirugia: {
    benefits: [
      "Soluciones definitivas y efectivas",
      "Procedimientos cuidadosos y seguros",
      "Recuperación optimizada",
      "Atención especializada post-operatoria",
    ],
    features: [
      "Diagnóstico previo completo",
      "Anestesia y sedación disponible",
      "Protocolos de seguridad estrictos",
      "Seguimiento post-quirúrgico",
    ],
  },
  ortodoncia: {
    benefits: [
      "Corrige la alineación dental",
      "Mejora la función masticatoria",
      "Previene problemas futuros",
      "Opciones discretas disponibles",
    ],
    features: [
      "Estudio ortodóntico completo",
      "Múltiples opciones de tratamiento",
      "Controles periódicos incluidos",
      "Resultados predecibles",
    ],
  },
  otros: {
    benefits: [
      "Atención personalizada",
      "Profesionales altamente capacitados",
      "Calidad en cada detalle",
      "Seguimiento continuo",
    ],
    features: [
      "Atención integral",
      "Materiales de primera calidad",
      "Profesionales certificados",
      "Ambiente cómodo y seguro",
    ],
  },
};

export const contentForCategory = (category: string): CategoryContent =>
  CATEGORY_CONTENT[category] ?? CATEGORY_CONTENT.otros;
