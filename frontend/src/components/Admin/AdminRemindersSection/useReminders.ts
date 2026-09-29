import { useMemo, useState } from "react";
import type { ReminderDto } from "@odonto/shared";
import { useApi } from "@/hooks/useApi";
import { useWriteAction } from "@/hooks/useWriteAction";
import { remindersApi } from "@/services";
import { toApiTimestamp } from "@/utils/clinicTime";
import { daysUntil } from "@/utils/date";
import { normalizeText } from "@/utils/text";

export type ReminderView = "pending" | "done" | "all";

export interface ReminderItem extends ReminderDto {
  due: Date;
  /** Calendar days until due: negative when overdue. */
  days: number;
}

export interface ReminderGroup {
  id: string;
  label: string;
  items: ReminderItem[];
}

export interface NewReminder {
  title: string;
  description: string;
  /** "2026-10-01" */
  date: string;
  /** "10:00" */
  time: string;
}

/** Pending reminders fall into these buckets by how soon they are due. */
const BUCKETS: Array<{ id: string; label: string; test: (days: number) => boolean }> = [
  { id: "overdue", label: "Vencidos", test: (d) => d < 0 },
  { id: "today", label: "Hoy", test: (d) => d === 0 },
  { id: "week", label: "Próximos 7 días", test: (d) => d > 0 && d <= 7 },
  { id: "later", label: "Más adelante", test: (d) => d > 7 },
];

export function useReminders() {
  const { data, loading, error, reload } = useApi(() => remindersApi.list(), []);
  const { saving, actionError, runWrite } = useWriteAction(reload);
  const [view, setView] = useState<ReminderView>("pending");
  const [search, setSearch] = useState("");

  const items = useMemo<ReminderItem[]>(
    () =>
      (data?.items ?? [])
        .map((r) => ({ ...r, due: new Date(r.dueAt), days: daysUntil(new Date(r.dueAt)) }))
        .sort((a, b) => a.due.getTime() - b.due.getTime()),
    [data],
  );

  const matching = useMemo(() => {
    const term = normalizeText(search);
    return term ? items.filter((r) => normalizeText(`${r.title} ${r.description}`).includes(term)) : items;
  }, [items, search]);

  const counts = {
    pending: matching.filter((r) => !r.done).length,
    done: matching.filter((r) => r.done).length,
    all: matching.length,
  };

  const groups = useMemo<ReminderGroup[]>(() => {
    const pending = matching.filter((r) => !r.done);
    const done = matching.filter((r) => r.done);
    const buckets = BUCKETS.map((b) => ({ id: b.id, label: b.label, items: pending.filter((r) => b.test(r.days)) }));
    const doneGroup = { id: "done", label: "Hechos", items: done.slice().reverse() };

    const shown = view === "pending" ? buckets : view === "done" ? [doneGroup] : [...buckets, doneGroup];
    return shown.filter((group) => group.items.length > 0);
  }, [matching, view]);

  const create = (form: NewReminder) =>
    runWrite(
      () =>
        remindersApi.create({
          title: form.title.trim(),
          description: form.description.trim(),
          dueAt: toApiTimestamp(form.date, form.time || "09:00"),
          done: false,
        }),
      "No pudimos crear el recordatorio",
    );

  const toggleDone = (item: ReminderItem) =>
    runWrite(() => remindersApi.update(item.id, { done: !item.done }), "No pudimos actualizar el recordatorio");

  const remove = (item: ReminderItem) =>
    runWrite(() => remindersApi.remove(item.id), "No pudimos eliminar el recordatorio");

  return {
    loading,
    error,
    reload,
    saving,
    actionError,
    view,
    setView,
    search,
    setSearch,
    counts,
    groups,
    create,
    toggleDone,
    remove,
  };
}
