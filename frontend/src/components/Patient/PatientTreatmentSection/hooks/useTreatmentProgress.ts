import { useCallback, useState } from "react";
import type { TreatmentProgressDto } from "@odonto/shared";
import type { PhaseProgress, TreatmentProgress } from "../types";

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

interface ProgressForm {
  completed: number;
  total: number;
  phasePercentage: number;
  phaseLabel: string;
}

/** The progress card and its editor; saving hands the new values to `onSave`. */
export function useTreatmentProgress(saved: TreatmentProgressDto, onSave: (progress: TreatmentProgressDto) => Promise<boolean>) {
  const general: TreatmentProgress = { completed: saved.completed, total: saved.total };
  const phase: PhaseProgress = { percentage: saved.phasePercentage, label: saved.phaseLabel };
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<ProgressForm>(saved);

  const openEditor = useCallback(() => {
    setForm(saved);
    setEditorOpen(true);
  }, [saved]);

  const save = useCallback(async () => {
    const total = Math.max(0, Number(form.total) || 0);
    const completed = Math.min(Math.max(0, Number(form.completed) || 0), total);
    const ok = await onSave({
      completed,
      total,
      phasePercentage: clampPercent(Number(form.phasePercentage) || 0),
      phaseLabel: form.phaseLabel.trim(),
    });
    if (ok) setEditorOpen(false);
  }, [form, onSave]);

  return {
    general,
    phase,
    generalPercent: general.total ? clampPercent(Math.round((general.completed / general.total) * 100)) : 0,
    editorOpen,
    openEditor,
    closeEditor: useCallback(() => setEditorOpen(false), []),
    form,
    patchForm: useCallback((patch: Partial<ProgressForm>) => setForm((current) => ({ ...current, ...patch })), []),
    save,
  };
}
