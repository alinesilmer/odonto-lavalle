export const SERVICE_TABS = [
  { id: "overview", label: "Resumen" },
  { id: "benefits", label: "Beneficios" },
  { id: "procedure", label: "Procedimiento" },
  { id: "care", label: "Cuidados" },
  { id: "faqs", label: "FAQs" },
] as const;

export type ServiceTabKey = (typeof SERVICE_TABS)[number]["id"];
