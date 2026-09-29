import { Pill, Stethoscope } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import ItemList from "@/components/UI/ItemList/ItemList";
import Panel from "@/components/UI/Panel/Panel";
import ProgressMeter from "@/components/UI/ProgressMeter/ProgressMeter";
import { toCalendarDay } from "@/utils/calendar";
import { formatShortDate } from "@/utils/date";
import DentalChart from "./DentalChart";
import type { useToothChart } from "../hooks/useToothChart";
import type { useTreatmentProgress } from "../hooks/useTreatmentProgress";
import type { MedicalCondition, Medication } from "../types";
import styles from "../PatientTreatmentSection.module.scss";

interface OverviewTabProps {
  isAdmin: boolean;
  chart: ReturnType<typeof useToothChart>;
  progress: ReturnType<typeof useTreatmentProgress>;
  conditions: MedicalCondition[];
  medications: Medication[];
  onEditConditions: () => void;
  onEditMedications: () => void;
}

/** "Editar" for admins; patients only read. */
const edit = (isAdmin: boolean, onClick: () => void) =>
  isAdmin ? (
    <Button variant="link" size="small" onClick={onClick}>
      Editar
    </Button>
  ) : undefined;

const OverviewTab = ({
  isAdmin,
  chart,
  progress,
  conditions,
  medications,
  onEditConditions,
  onEditMedications,
}: OverviewTabProps) => (
  <div id="panel-overview" role="tabpanel" className={styles.overview}>
    <Panel eyebrow="Avance" title="Progreso del tratamiento" action={edit(isAdmin, progress.openEditor)}>
      <div className={styles.meters}>
        <ProgressMeter
          label="Tratamiento general"
          percent={progress.generalPercent}
          caption={progress.general.total ? `${progress.general.completed} de ${progress.general.total} procedimientos completados` : "Todavía no se cargó el plan"}
        />
        <ProgressMeter label="Fase actual" percent={progress.phase.percentage} caption={progress.phase.label || "Sin fase definida"} />
      </div>
    </Panel>

    {isAdmin ? (
      <Panel eyebrow="Odontograma" title="Estado de cada pieza">
        <DentalChart chart={chart} editable />
      </Panel>
    ) : null}

    <div className={styles.pair}>
      <Panel eyebrow="Salud general" title="Condiciones médicas" action={edit(isAdmin, onEditConditions)}>
        <ItemList
          emptyMessage="Sin condiciones registradas."
          items={conditions.map((c, i) => {
            const day = toCalendarDay(c.date);
            return {
              key: `${c.name}-${i}`,
              leading: <Stethoscope size={18} strokeWidth={1.7} aria-hidden="true" />,
              title: c.name,
              meta: c.diagnosis,
              trailing: day ? formatShortDate(day) : undefined,
            };
          })}
        />
      </Panel>

      <Panel eyebrow="Indicaciones" title="Medicación actual" action={edit(isAdmin, onEditMedications)}>
        <ItemList
          emptyMessage="Sin medicación registrada."
          items={medications.map((m, i) => ({
            key: `${m.name}-${i}`,
            leading: <Pill size={18} strokeWidth={1.7} aria-hidden="true" />,
            title: m.name,
            meta: m.dosage,
          }))}
        />
      </Panel>
    </div>
  </div>
);

export default OverviewTab;
