/** Closed value sets shared by the API and both clients. */

export const ROLES = ["admin", "patient"] as const;
export type Role = (typeof ROLES)[number];

export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const PAYMENT_STATUSES = ["pending", "partial", "paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PATIENT_STATUSES = ["active", "inactive"] as const;
export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const SUPPORT_TICKET_STATUSES = ["open", "closed"] as const;
export type SupportTicketStatus = (typeof SUPPORT_TICKET_STATUSES)[number];

export const GENDERS = ["masculino", "femenino", "otro"] as const;
export type Gender = (typeof GENDERS)[number];

export const INSURANCES = [
  "galeno",
  "swiss",
  "medife",
  "sancor",
  "ospim",
  "ospjn",
  "issunne",
  "otro",
  "ninguna",
] as const;
export type Insurance = (typeof INSURANCES)[number];

/** Display names for the closed value sets. Defined once, used on both sides. */
export const INSURANCE_LABEL: Record<Insurance, string> = {
  galeno: "Galeno",
  swiss: "Swiss Medical",
  medife: "Medifé",
  sancor: "SanCor Salud",
  ospim: "OSPIM",
  ospjn: "OSPJN",
  issunne: "ISSUNNE",
  otro: "Otra",
  ninguna: "Ninguna",
};

export const GENDER_LABEL: Record<Gender, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  otro: "Otro",
};

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  completed: "Completado",
  cancelled: "Cancelado",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Pendiente",
  partial: "Parcial",
  paid: "Completo",
};

export const PATIENT_STATUS_LABEL: Record<PatientStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};
