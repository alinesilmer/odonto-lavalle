/** Public contact form and the free-text capture in the footer. */
import { z } from "zod";
import { contactSchema as apiContactSchema, newsletterSchema } from "@odonto/shared";

/**
 * The page asks for a subject line on top of the API's fields; it is folded
 * into `message` before the request goes out.
 */
export const contactFormSchema = apiContactSchema.extend({
  reason: z.string().trim().min(1, "Contanos el motivo de tu consulta").max(120),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export { newsletterSchema };
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const publicMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (mínimo 10 caracteres)")
    .max(2000, "El mensaje es demasiado largo"),
});

export type PublicMessageFormData = z.infer<typeof publicMessageSchema>;
