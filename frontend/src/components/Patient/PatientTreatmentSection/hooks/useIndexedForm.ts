import { useCallback, useState } from "react";

export interface IndexedForm<T> {
  open: boolean;
  /** null while adding, the row index while editing. */
  editingIndex: number | null;
  form: T;
  startAdd: () => void;
  startEdit: (index: number, item: T) => void;
  close: () => void;
  patch: (patch: Partial<T>) => void;
  submit: () => Promise<void>;
}

/**
 * An add-or-edit dialog over a list. The timeline and the
 * planned-appointment cards behave identically, so they share this.
 */
export function useIndexedForm<T extends object>(
  emptyForm: T,
  isValid: (form: T) => boolean,
  /** Return false (or resolve to it) to keep the dialog open, e.g. when saving failed. */
  onCommit: (form: T, index: number | null) => boolean | void | Promise<boolean | void>,
): IndexedForm<T> {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<T>(emptyForm);

  const close = useCallback(() => {
    setOpen(false);
    setEditingIndex(null);
  }, []);

  return {
    open,
    editingIndex,
    form,
    close,
    startAdd: useCallback(() => {
      setEditingIndex(null);
      setForm(emptyForm);
      setOpen(true);
    }, [emptyForm]),
    startEdit: useCallback((index: number, item: T) => {
      setEditingIndex(index);
      setForm({ ...item });
      setOpen(true);
    }, []),
    patch: useCallback((values: Partial<T>) => setForm((current) => ({ ...current, ...values })), []),
    submit: useCallback(async () => {
      if (!isValid(form)) return;
      if ((await onCommit(form, editingIndex)) === false) return;
      close();
    }, [close, editingIndex, form, isValid, onCommit]),
  };
}

/** Inserts at the front when adding, replaces in place when editing. */
export function upsertAt<T>(list: T[], item: T, index: number | null): T[] {
  return index === null ? [item, ...list] : list.map((row, i) => (i === index ? item : row));
}
