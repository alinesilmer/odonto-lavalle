import { useCallback, useState } from "react";

export interface EditableList<T> {
  draft: T[];
  open: boolean;
  start: (items: T[]) => void;
  close: () => void;
  addRow: () => void;
  removeRow: (index: number) => void;
  updateRow: (index: number, patch: Partial<T>) => void;
}

/**
 * The add/remove/edit-row dance behind the conditions and medications dialogs.
 * Both had their own copy of it; this is the one implementation.
 */
export function useEditableList<T extends object>(emptyRow: () => T): EditableList<T> {
  const [draft, setDraft] = useState<T[]>([]);
  const [open, setOpen] = useState(false);

  const start = useCallback((items: T[]) => {
    setDraft(items.map((item) => ({ ...item })));
    setOpen(true);
  }, []);

  return {
    draft,
    open,
    start,
    close: useCallback(() => setOpen(false), []),
    addRow: useCallback(() => setDraft((rows) => [...rows, emptyRow()]), [emptyRow]),
    removeRow: useCallback(
      (index) => setDraft((rows) => rows.filter((_, i) => i !== index)),
      [],
    ),
    updateRow: useCallback(
      (index, patch) =>
        setDraft((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row))),
      [],
    ),
  };
}
