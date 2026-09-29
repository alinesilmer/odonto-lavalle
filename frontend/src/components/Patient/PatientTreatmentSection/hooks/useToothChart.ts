import { useCallback, useState } from "react";
import { TOOTH_STATUS_INFO } from "../labels";
import type { Tooth, ToothStatus } from "../types";

interface Draft {
  status: ToothStatus;
  notes: string;
}

/**
 * Odontogram editing: selecting a tooth loads its state and description into a
 * draft; saving hands the updated chart to `onSave` (which persists it).
 */
export function useToothChart(teeth: Tooth[], onSave: (teeth: Tooth[]) => Promise<boolean>) {
  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>({ status: "sano", notes: "" });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const current = teeth.find((tooth) => tooth.number === selected) ?? null;
  const dirty = Boolean(current && (current.status !== draft.status || current.notes !== draft.notes));

  const select = useCallback(
    (number: number) => {
      const tooth = teeth.find((t) => t.number === number);
      if (!tooth) return;
      setSelected(number);
      setDraft({ status: tooth.status, notes: tooth.notes });
      setSavedAt(null);
    },
    [teeth],
  );

  const save = useCallback(async () => {
    if (selected == null) return;
    const next = teeth.map((tooth) => (tooth.number === selected ? { ...tooth, ...draft } : tooth));
    if (await onSave(next)) setSavedAt(Date.now());
  }, [selected, draft, teeth, onSave]);

  const discard = useCallback(() => {
    if (current) setDraft({ status: current.status, notes: current.notes });
  }, [current]);

  return {
    teeth,
    selected,
    current,
    select,
    close: useCallback(() => setSelected(null), []),
    draft,
    setStatus: useCallback((status: ToothStatus) => setDraft((d) => ({ ...d, status })), []),
    setNotes: useCallback((notes: string) => setDraft((d) => ({ ...d, notes })), []),
    dirty,
    /** Set right after a save, to show a confirmation until the next change. */
    justSaved: savedAt !== null && !dirty,
    save,
    discard,
    /** Teeth that still need attention: something pending or a treatment under way. */
    inTreatmentCount: teeth.filter((tooth) => ["pending", "treatment"].includes(TOOTH_STATUS_INFO[tooth.status].group)).length,
  };
}
