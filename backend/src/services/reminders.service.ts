import type { ReminderDto } from "@odonto/shared";
import { collections } from "../config/firebase.js";
import { createRepository } from "../lib/repository.js";
import { bool, fieldsOf, iso, str } from "../lib/firestore.js";

export const remindersRepo = createRepository<ReminderDto>(
  collections.reminders,
  (snap) => {
    const d = fieldsOf(snap);
    return {
      id: snap.id,
      title: str(d.title),
      description: str(d.description),
      dueAt: iso(d.dueAt),
      done: bool(d.done),
      createdAt: iso(d.createdAt),
    };
  },
  "Recordatorio no encontrado",
);

export const listReminders = () => remindersRepo.list((q) => q.orderBy("dueAt", "asc"));
