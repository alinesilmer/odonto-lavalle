import FormGrid from "@/components/UI/FormGrid/FormGrid";
import Input from "@/components/UI/Input/Input";
import FormModal from "@/components/UI/Modal/FormModal";
import type { useTreatmentProgress } from "../hooks/useTreatmentProgress";

interface ProgressModalProps {
  progress: ReturnType<typeof useTreatmentProgress>;
}

const ProgressModal = ({ progress }: ProgressModalProps) => (
  <FormModal
    open={progress.editorOpen}
    eyebrow="Tratamiento"
    title="Progreso"
    onClose={progress.closeEditor}
    onConfirm={() => void progress.save()}
    confirmLabel="Guardar cambios"
  >
    <FormGrid>
      <Input
        name="completed"
        label="Procedimientos completados"
        type="number"
        min={0}
        inputMode="numeric"
        value={progress.form.completed}
        onChange={(e) => progress.patchForm({ completed: Number(e.target.value) })}
      />
      <Input
        name="total"
        label="Procedimientos en total"
        type="number"
        min={1}
        inputMode="numeric"
        value={progress.form.total}
        onChange={(e) => progress.patchForm({ total: Number(e.target.value) })}
      />
      <Input
        name="phasePercentage"
        label="Avance de la fase (%)"
        type="number"
        min={0}
        max={100}
        inputMode="numeric"
        value={progress.form.phasePercentage}
        onChange={(e) => progress.patchForm({ phasePercentage: Number(e.target.value) })}
      />
      <Input
        name="phaseLabel"
        label="Fase actual"
        placeholder="Ej: Endodoncia pieza 45"
        value={progress.form.phaseLabel}
        onChange={(e) => progress.patchForm({ phaseLabel: e.target.value })}
      />
    </FormGrid>
  </FormModal>
);

export default ProgressModal;
