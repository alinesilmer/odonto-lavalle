import type { Role, SupportTicketDto, SupportTicketStatus } from "@odonto/shared";
import { collections } from "../config/firebase.js";
import { createRepository } from "../lib/repository.js";
import { fieldsOf, iso, str } from "../lib/firestore.js";

export const supportRepo = createRepository<SupportTicketDto>(
  collections.supportTickets,
  (snap) => {
    const d = fieldsOf(snap);
    return {
      id: snap.id,
      subject: str(d.subject),
      body: str(d.body),
      status: str(d.status, "open") as SupportTicketStatus,
      authorId: str(d.authorId),
      authorName: str(d.authorName),
      createdAt: iso(d.createdAt),
    };
  },
  "Ticket no encontrado",
);

/** Patients only see the tickets they opened; admins triage all of them. */
export async function listTicketsFor(actor: { uid: string; role: Role }) {
  const tickets = await supportRepo.list((q) =>
    actor.role === "admin" ? q : q.where("authorId", "==", actor.uid),
  );
  // Sorted here rather than in Firestore, which would need a composite index.
  return tickets.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
