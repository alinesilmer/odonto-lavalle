import { useCallback, useState } from "react";
import { EMPTY_TREATMENT_PROGRESS } from "@odonto/shared";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import { useEditableList } from "./hooks/useEditableList";
import { upsertAt, useIndexedForm } from "./hooks/useIndexedForm";
import { useToothChart } from "./hooks/useToothChart";
import { useTreatmentProgress } from "./hooks/useTreatmentProgress";
import { useTreatmentRecord } from "./hooks/useTreatmentRecord";
import { CalendarDays, CheckCircle2, Activity } from "lucide-react";
import PatientFiles from "@/components/Patient/PatientFiles/PatientFiles";
import { usePatientFiles } from "@/components/Patient/PatientFiles/usePatientFiles";
import Alert from "@/components/UI/Alert/Alert";
import { FEATURES } from "@/constants";
import FichaActions from "./print/FichaActions";
import TreatmentPrintSheet from "./print/TreatmentPrintSheet";
import Tabs from "@/components/UI/Tabs/Tabs";
import { TAB_LABEL } from "./labels";
import PatientHeader from "./PatientHeader";
import AppointmentsTab from "./tabs/AppointmentsTab";
import OverviewTab from "./tabs/OverviewTab";
import TimelineTab from "./tabs/TimelineTab";
import PlannedAppointmentModal from "./modals/PlannedAppointmentModal";
import ProgressModal from "./modals/ProgressModal";
import RowListModal from "./modals/RowListModal";
import TimelineModal from "./modals/TimelineModal";
import { TAB_IDS } from "./types";
import type {
  MedicalCondition,
  Medication,
  PlannedAppointment,
  TabId,
  TimelineEntry,
  Tooth,
} from "./types";
import styles from "./PatientTreatmentSection.module.scss";

const EMPTY_TIMELINE_ENTRY: TimelineEntry = {
  date: "",
  title: "",
  status: "scheduled",
  description: "",
};
const EMPTY_APPOINTMENT: PlannedAppointment = { date: "", time: "", type: "", doctor: "" };

// Stable empties while the record loads, so hooks don't see a new array each render.
const NONE_TEETH: Tooth[] = [];
const NONE_TIMELINE: TimelineEntry[] = [];
const NONE_VISITS: PlannedAppointment[] = [];

const emptyCondition =(): MedicalCondition => ({ name: "", diagnosis: "", date: "" });
const emptyMedication = (): Medication => ({ name: "", dosage: "" });

const TreatmentContent = ({ isAdmin }: { isAdmin: boolean }) => {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const record = useTreatmentRecord(isAdmin);
  const { persist } = record;
  const treatment = record.treatment;
  const timeline = treatment?.timeline ?? NONE_TIMELINE;
  const appointments = treatment?.plannedVisits ?? NONE_VISITS;
  // No request at all while attachments are switched off.
  const files = usePatientFiles(FEATURES.patientFiles ? record.patientId : "");

  const chart = useToothChart(treatment?.teeth ?? NONE_TEETH, useCallback((teeth) => persist({ teeth }), [persist]));
  const progress = useTreatmentProgress(
    treatment?.progress ?? EMPTY_TREATMENT_PROGRESS,
    useCallback((next) => persist({ progress: next }), [persist]),
  );

  const timelineForm = useIndexedForm<TimelineEntry>(
    EMPTY_TIMELINE_ENTRY,
    (form) => Boolean(form.title && form.date),
    useCallback((entry, index) => persist({ timeline: upsertAt(timeline, entry, index) }), [persist, timeline]),
  );

  const appointmentForm = useIndexedForm<PlannedAppointment>(
    EMPTY_APPOINTMENT,
    (form) => Boolean(form.type && form.date && form.time),
    useCallback((entry, index) => persist({ plannedVisits: upsertAt(appointments, entry, index) }), [persist, appointments]),
  );

  const conditionsList = useEditableList<MedicalCondition>(emptyCondition);
  const medicationsList = useEditableList<Medication>(emptyMedication);

  const saveConditions = async () => {
    if (await record.saveConditions(conditionsList.draft)) conditionsList.close();
  };

  const saveMedications = async () => {
    if (await record.saveMedications(medicationsList.draft)) medicationsList.close();
  };

  return (
    <div className={styles.wrap}>
      <AsyncBoundary loading={record.loading} error={record.error} onRetry={record.reload}>
        {record.saveError ? <Alert>{record.saveError}</Alert> : null}

        <PatientHeader
          treatment={record.treatment}
          stats={[
            { label: "Próximas visitas", value: appointments.length, icon: CalendarDays },
            { label: "Etapas completadas", value: timeline.filter((entry) => entry.status === "completed").length, icon: CheckCircle2 },
            { label: "Piezas en seguimiento", value: chart.inTreatmentCount, icon: Activity },
          ]}
        />

        <div className={styles.toolbar}>
          <Tabs
            items={TAB_IDS.map((id) => ({ id, label: TAB_LABEL[id], count: id === "files" ? files.files.length : undefined }))}
            active={activeTab}
            onChange={setActiveTab}
            label="Secciones del tratamiento"
          />
          <FichaActions patientName={treatment?.patientName ?? "paciente"} disabled={!treatment} />
        </div>

        {activeTab === "files" ? <PatientFiles files={files} canEdit={isAdmin} /> : null}
        {treatment ? <TreatmentPrintSheet treatment={treatment} files={files.files} /> : null}

        {activeTab === "overview" ? (
          <OverviewTab
            isAdmin={isAdmin}
            chart={chart}
            progress={progress}
            conditions={record.conditions}
            medications={record.medications}
            onEditConditions={() => conditionsList.start(record.conditions)}
            onEditMedications={() => medicationsList.start(record.medications)}
          />
        ) : null}

        {activeTab === "timeline" ? (
          <TimelineTab
            isAdmin={isAdmin}
            entries={timeline}
            onAdd={timelineForm.startAdd}
            onEdit={(index) => timelineForm.startEdit(index, timeline[index])}
          />
        ) : null}

        {activeTab === "appointments" ? (
          <AppointmentsTab
            isAdmin={isAdmin}
            appointments={appointments}
            onAdd={appointmentForm.startAdd}
            onEdit={(index) => appointmentForm.startEdit(index, appointments[index])}
          />
        ) : null}

        <ProgressModal progress={progress} />
        <RowListModal<MedicalCondition>
          title="Condiciones médicas"
          itemLabel="Condición"
          addLabel="Agregar condición"
          fields={[
            { key: "name", label: "Nombre", placeholder: "Ej: Diabetes tipo 2" },
            { key: "date", label: "Fecha de diagnóstico", type: "date" },
            { key: "diagnosis", label: "Diagnóstico", type: "multiline", full: true, placeholder: "Detalle del diagnóstico y cuidados a tener en cuenta" },
          ]}
          list={conditionsList}
          busy={record.saving}
          error={record.saveError}
          onSave={() => void saveConditions()}
        />
        <RowListModal<Medication>
          title="Medicación actual"
          itemLabel="Medicamento"
          addLabel="Agregar medicamento"
          fields={[
            { key: "name", label: "Medicamento", placeholder: "Ej: Amoxicilina 500 mg" },
            { key: "dosage", label: "Indicación", placeholder: "Ej: cada 8 h durante 7 días" },
          ]}
          list={medicationsList}
          busy={record.saving}
          error={record.saveError}
          onSave={() => void saveMedications()}
        />
        <TimelineModal form={timelineForm} />
        <PlannedAppointmentModal form={appointmentForm} />
      </AsyncBoundary>
    </div>
  );
};

export default TreatmentContent;
