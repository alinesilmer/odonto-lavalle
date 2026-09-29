/**
 * The one definition of every field rule the API enforces.
 *
 * Both sides import these: the backend to reject bad payloads, the frontend to
 * show the same message before the round-trip. Changing a rule here changes it
 * everywhere, so client and server can never drift apart.
 */
import { z } from "zod";
import { GENDERS, INSURANCES } from "./enums";

export const PATTERNS = {
  dni: /^\d{7,8}$/,
  phone: /^\d{7,15}$/,
  /** Letters and spaces, accents included. */
  personName: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  isoDate: /^\d{4}-\d{2}-\d{2}$/,
  timeOfDay: /^([01]\d|2[0-3]):[0-5]\d$/,
} as const;

export const MIN_SIGNUP_AGE = 18;
export const MAX_SIGNUP_AGE = 90;
export const MIN_PASSWORD_LENGTH = 8;

export const zEmail = z
  .string()
  .trim()
  .min(1, "El correo electrónico es obligatorio")
  .email("Por favor, ingresá un correo electrónico válido")
  .toLowerCase();

export const zFullName = z
  .string()
  .trim()
  .min(1, "El nombre completo es obligatorio")
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(100, "El nombre es demasiado largo")
  .regex(PATTERNS.personName, "El nombre solo puede contener letras");

export const zDni = z
  .string()
  .trim()
  .min(1, "El DNI es obligatorio")
  .regex(PATTERNS.dni, "El DNI debe tener 7 u 8 dígitos sin puntos");

export const zPhone = z
  .string()
  .trim()
  .min(1, "El teléfono es obligatorio")
  .regex(PATTERNS.phone, "El teléfono debe tener entre 7 y 15 dígitos sin espacios");

export const zIsoDate = z.string().regex(PATTERNS.isoDate, "Fecha inválida");

export const zPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`)
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

export const zGender = z.enum(GENDERS, { message: "Seleccioná una opción válida" });
export const zInsurance = z.enum(INSURANCES, { message: "Seleccioná una opción válida" });

/**
 * A select whose empty value means "nothing chosen yet".
 *
 * The parsed output is the narrow union, but the *input* stays `string`, so a
 * form can start out empty without lying about its types.
 */
export const requiredChoice = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) => z.string().min(1, message).pipe(z.enum(values));

/** Whole years between `isoDate` and now. */
export function ageFrom(isoDate: string, now: Date = new Date()): number {
  const born = new Date(isoDate);
  if (Number.isNaN(born.getTime())) return Number.NaN;

  let age = now.getUTCFullYear() - born.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - born.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < born.getUTCDate())) age -= 1;
  return age;
}

export const zBirthDate = z
  .string()
  .min(1, "La fecha de nacimiento es obligatoria")
  .refine((value) => {
    const age = ageFrom(value);
    return age >= MIN_SIGNUP_AGE && age <= MAX_SIGNUP_AGE;
  }, `Debés tener al menos ${MIN_SIGNUP_AGE} años para registrarte`);

/* ------------------------------ request bodies ---------------------------- */

export const loginSchema = z.object({
  email: zEmail,
  password: z.string().min(1, "La contraseña es obligatoria"),
});

/** What the API accepts. The frontend adds a `confirmPassword` check on top. */
export const registerSchema = z.object({
  fullName: zFullName,
  dni: zDni,
  gender: zGender,
  email: zEmail,
  phone: zPhone,
  birthDate: zBirthDate,
  password: zPassword,
  insurance: zInsurance,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
  newPassword: zPassword,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio").max(100),
  email: zEmail,
  phone: zPhone,
  message: z.string().trim().min(10, "Contanos un poco más (mínimo 10 caracteres)").max(2000),
});

export const newsletterSchema = z.object({ email: zEmail });

/**
 * A patient the clinic adds from the dashboard, without a login. Unlike
 * sign-up there is no minimum age (children are patients too) and email is
 * optional; if the person registers later with the same DNI, their account
 * takes over this record.
 */
export const createPatientSchema = z.object({
  fullName: zFullName,
  dni: zDni,
  gender: zGender,
  email: z.union([zEmail, z.literal("")]).default(""),
  phone: zPhone,
  birthDate: zIsoDate.refine((value) => new Date(value) <= new Date(), "La fecha no puede ser futura"),
  insurance: zInsurance,
});
export type CreatePatientRequest = z.input<typeof createPatientSchema>;
