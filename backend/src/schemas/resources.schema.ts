import { z } from "zod";
import { SUPPORT_TICKET_STATUSES } from "@odonto/shared";

export const upsertStockSchema = z.object({
  product: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  quantity: z.coerce.number().int().min(0),
  unit: z.string().trim().min(1).max(20),
  price: z.coerce.number().min(0),
  minQuantity: z.coerce.number().int().min(0).default(0),
});

export const upsertReminderSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  dueAt: z.string().datetime(),
  done: z.boolean().default(false),
});

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  body: z.string().trim().min(5).max(4000),
});

export const ticketStatusSchema = z.object({
  status: z.enum(SUPPORT_TICKET_STATUSES),
});

export type UpsertStockBody = z.infer<typeof upsertStockSchema>;
export type UpsertReminderBody = z.infer<typeof upsertReminderSchema>;
export type CreateTicketBody = z.infer<typeof createTicketSchema>;
