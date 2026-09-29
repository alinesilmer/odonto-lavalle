import type { ContactFormData } from "@/schemas";

/** The pre-filled WhatsApp text the visitor only has to press Send on. */
export function buildWhatsappMessage(data: ContactFormData): string {
  return [
    "📩 *Nueva consulta desde la web*",
    "",
    `*Nombre:* ${data.name}`,
    `*Motivo:* ${data.reason}`,
    `*Email:* ${data.email}`,
    `*Teléfono:* ${data.phone}`,
    "",
    "*Mensaje:*",
    data.message,
  ].join("\n");
}
