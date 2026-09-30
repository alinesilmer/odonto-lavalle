/** Sign-in and sign-up forms. The field rules themselves live in @odonto/shared. */
import { z } from "zod";
import {
  GENDERS,
  loginSchema as apiLoginSchema,
  registerSchema as apiRegisterSchema,
  requiredChoice,
} from "@odonto/shared";

export const loginSchema = apiLoginSchema;
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * The API's register body plus the two things only the browser cares about: a
 * confirmation field, and selects that start empty.
 */
export const registerSchema = apiRegisterSchema
  .extend({
    gender: requiredChoice(GENDERS, "Por favor, seleccioná tu género"),
    // Any obra social from the clinic's list (see useInsuranceOptions), or "Particular".
    insurance: z.string().trim().min(1, "Por favor, seleccioná tu obra social"),
    confirmPassword: z.string().min(1, "Por favor, confirmá tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

/** What the form holds while it is being filled in. */
export type RegisterFormInput = z.input<typeof registerSchema>;
/** What a valid submit produces. */
export type RegisterFormData = z.output<typeof registerSchema>;
