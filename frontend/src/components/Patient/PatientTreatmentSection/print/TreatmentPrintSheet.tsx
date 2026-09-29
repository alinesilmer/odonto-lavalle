import { GENDER_LABEL, PATIENT_FILE_TYPES, type PatientFileDto, type TreatmentDto } from "@odonto/shared";
import logo from "@/assets/images/Logo.webp";
import PrintSheet, { PrintSection, PrintTable } from "@/components/UI/PrintSheet/PrintSheet";
import { contactInfo } from "@/data/contactInfo";
import { fromIsoDate, toCalendarDay } from "@/utils/calendar";
import { displayAddress, formattedPhone } from "@/utils/clinicContact";
import { formatDateAR } from "@/utils/date";
import { TIMELINE_STATUS_LABEL, TOOTH_STATUS_INFO, toothName } from "../labels";
import PrintOdontogram from "./PrintOdontogram";
import styles from "./TreatmentPrintSheet.module.scss";

/** "2026-03-14" → "14/03/2026"; blank stays blank. */
const day = (iso: string) => {
  const date = fromIsoDate(iso) ?? toCalendarDay(iso);
  return date ? formatDateAR(date) : "—";
};

interface TreatmentPrintSheetProps {
  treatment: TreatmentDto;
  files: PatientFileDto[];
}

/** The patient's treatment file for the paper folder: identity, odontogram, clinical data, plan and attachments. */
const TreatmentPrintSheet = ({ treatment: t, files }: TreatmentPrintSheetProps) => {
  const markedTeeth = t.teeth.filter((tooth) => tooth.status !== "sano" || tooth.notes.trim());
  const identity: [string, string][] = [
    ["Paciente", t.patientName],
    ["DNI", t.dni || "—"],
    ["Edad", t.age != null ? `${t.age} años` : "—"],
    ["Género", GENDER_LABEL[t.gender] ?? "—"],
    ["Peso", t.weightKg ? `${t.weightKg} kg` : "—"],
    ["Altura", t.heightCm ? `${t.heightCm} cm` : "—"],
    ["IMC", t.bmi ? String(t.bmi) : "—"],
  ];

  return (
    <PrintSheet>
      <header className={styles.header}>
        <div className={styles.clinic}>
          <img src={logo} alt="" className={styles.logo} />
          <div>
            <strong>Lavalle Odontología</strong>
            <span>{displayAddress}</span>
            <span>
              Tel. {formattedPhone} · {contactInfo.email}
            </span>
          </div>
        </div>
        <div className={styles.docTitle}>
          <strong>Ficha odontológica</strong>
          <span>Impresa el {formatDateAR(new Date())}</span>
        </div>
      </header>

      <dl className={styles.identity}>
        {identity.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <PrintSection title="Odontograma">
        <PrintOdontogram teeth={t.teeth} />
      </PrintSection>

      <PrintSection title="Observaciones por pieza">
        <PrintTable
          columns={["Pieza", "Estado", "Observación"]}
          rows={markedTeeth.map((tooth) => [
            <>
              <strong>{tooth.number}</strong> <span className={styles.muted}>{toothName(tooth.number)}</span>
            </>,
            TOOTH_STATUS_INFO[tooth.status].label,
            tooth.notes || "—",
          ])}
          empty="Todas las piezas sanas, sin observaciones."
        />
      </PrintSection>

      <PrintSection title="Condiciones médicas">
        <PrintTable columns={["Condición", "Diagnóstico", "Desde"]} rows={t.conditions.map((c) => [c.name, c.diagnosis || "—", day(c.date)])} empty="Sin condiciones registradas." />
      </PrintSection>

      <PrintSection title="Medicación actual">
        <PrintTable columns={["Medicamento", "Indicación"]} rows={t.medications.map((m) => [m.name, m.dosage || "—"])} empty="Sin medicación registrada." />
      </PrintSection>

      <PrintSection title="Plan de tratamiento">
        {t.progress.total > 0 ? (
          <p className={styles.progress}>
            Avance: {t.progress.completed} de {t.progress.total} procedimientos
            {t.progress.phaseLabel ? ` · Fase actual: ${t.progress.phaseLabel} (${t.progress.phasePercentage}%)` : ""}
          </p>
        ) : null}
        <PrintTable
          columns={["Fecha", "Etapa", "Estado", "Detalle"]}
          rows={t.timeline.map((e) => [day(e.date), e.title, TIMELINE_STATUS_LABEL[e.status], e.description || "—"])}
          empty="Sin etapas cargadas."
        />
      </PrintSection>

      <PrintSection title="Próximas visitas">
        <PrintTable columns={["Fecha", "Hora", "Motivo", "Profesional"]} rows={t.plannedVisits.map((v) => [day(v.date), v.time || "—", v.type, v.doctor || "—"])} empty="Sin visitas planificadas." />
      </PrintSection>

      <PrintSection title="Archivos adjuntos en la ficha digital">
        <PrintTable
          columns={["Archivo", "Tipo", "Fecha", "Nota"]}
          rows={files.map((f) => [f.name, PATIENT_FILE_TYPES[f.contentType] ?? "Archivo", day(f.uploadedAt), f.note || "—"])}
          empty="Sin archivos adjuntos."
        />
      </PrintSection>

      <footer className={styles.signatures}>
        <div>Firma y sello del profesional</div>
        <div>Firma del paciente o responsable</div>
      </footer>
    </PrintSheet>
  );
};

export default TreatmentPrintSheet;
