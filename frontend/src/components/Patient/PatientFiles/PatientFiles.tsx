import { useRef, useState, type DragEvent } from "react";
import { FileImage, FileSpreadsheet, FileText, File as FileIcon, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { MAX_PATIENT_FILE_BYTES, PATIENT_FILE_ACCEPT, PATIENT_FILE_TYPES, type PatientFileDto } from "@odonto/shared";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import ComingSoonModal from "@/components/UI/ComingSoon/ComingSoonModal";
import { FEATURES } from "@/constants";
import { useConfirm } from "@/components/UI/Confirm/confirmContext";
import IconButton from "@/components/UI/IconButton/IconButton";
import Panel from "@/components/UI/Panel/Panel";
import Tabs from "@/components/UI/Tabs/Tabs";
import { toCalendarDay } from "@/utils/calendar";
import { formatShortDate } from "@/utils/date";
import { fileKind, formatBytes, type FileKind } from "@/utils/files";
import type { PatientFilesState } from "./usePatientFiles";
import styles from "./PatientFiles.module.scss";

const ICON: Record<FileKind, typeof FileIcon> = { image: FileImage, pdf: FileText, sheet: FileSpreadsheet, doc: FileText, other: FileIcon };

type Filter = "all" | "images" | "documents";
const matches = (file: PatientFileDto, filter: Filter) =>
  filter === "all" || (filter === "images") === (fileKind(file.contentType) === "image");

/** A patient's attachments (state from usePatientFiles): drop or pick files to upload, preview, open and delete. Read-only for patients. */
const PatientFiles = ({ files, canEdit }: { files: PatientFilesState; canEdit: boolean }) => {
  const confirm = useConfirm();
  const input = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [dragging, setDragging] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // While uploads are switched off (constants/features), every way in shows the notice instead.
  const openPicker = () => (FEATURES.patientFiles ? input.current?.click() : setComingSoon(true));
  const pick = (list: FileList | null) => {
    if (!FEATURES.patientFiles) return setComingSoon(true);
    if (list?.length) void files.upload(Array.from(list));
  };
  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (canEdit) pick(event.dataTransfer.files);
  };

  const remove = async (file: PatientFileDto) => {
    const ok = await confirm({ title: `¿Eliminar "${file.name}"?`, message: "El archivo se borra de la ficha y no se puede recuperar.", confirmLabel: "Eliminar", tone: "danger" });
    if (ok) void files.remove(file);
  };

  const count = (f: Filter) => files.files.filter((file) => matches(file, f)).length;
  const visible = files.files.filter((file) => matches(file, filter));

  return (
    <Panel
      eyebrow="Ficha del paciente"
      title="Archivos adjuntos"
      action={
        canEdit ? (
          <Button size="small" icon={<UploadCloud size={16} aria-hidden="true" />} onClick={openPicker}>
            Adjuntar archivos
          </Button>
        ) : null
      }
    >
      <input ref={input} type="file" multiple hidden accept={PATIENT_FILE_ACCEPT} onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />

      {canEdit ? (
        <button
          type="button"
          className={`${styles.drop} ${dragging ? styles.dragging : ""}`}
          onClick={openPicker}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <UploadCloud size={28} strokeWidth={1.4} aria-hidden="true" />
          <strong>Arrastrá archivos acá o hacé clic para elegirlos</strong>
          <span>
            Fotos, radiografías, PDF, Excel, Word o DICOM · hasta {formatBytes(MAX_PATIENT_FILE_BYTES)} cada uno
          </span>
        </button>
      ) : null}

      {files.queue.length > 0 ? (
        <ul className={styles.queue} aria-live="polite">
          {files.queue.map((item) => (
            <li key={item.key} className={item.state === "failed" ? styles.failed : undefined}>
              {item.state === "failed" ? <X size={16} aria-hidden="true" /> : <Loader2 size={16} className={styles.spin} aria-hidden="true" />}
              <span className={styles.queueName}>{item.name}</span>
              <span>{item.state === "failed" ? item.message : item.state === "uploading" ? "Subiendo…" : "En espera"}</span>
            </li>
          ))}
          {files.queue.some((item) => item.state === "failed") ? (
            <li><button type="button" className={styles.dismiss} onClick={files.dismissFailed}>Ocultar errores</button></li>
          ) : null}
        </ul>
      ) : null}

      {files.removeError ? <Alert>{files.removeError}</Alert> : null}

      <AsyncBoundary loading={files.loading} error={files.error} onRetry={files.reload}>
        {files.files.length > 0 ? (
          <Tabs
            items={[
              { id: "all" as const, label: "Todos", count: count("all") },
              { id: "images" as const, label: "Imágenes", count: count("images") },
              { id: "documents" as const, label: "Documentos", count: count("documents") },
            ]}
            active={filter}
            onChange={setFilter}
            label="Filtrar archivos"
          />
        ) : null}

        {visible.length === 0 ? (
          <p className={styles.empty}>
            {!FEATURES.patientFiles
              ? "Los archivos adjuntos van a estar disponibles muy pronto."
              : files.files.length === 0
                ? "Todavía no hay archivos en la ficha."
                : "No hay archivos de este tipo."}
          </p>
        ) : (
          <ul className={styles.grid}>
            {visible.map((file) => {
              const kind = fileKind(file.contentType);
              const Icon = ICON[kind];
              const day = toCalendarDay(file.uploadedAt);
              return (
                <li key={file.id} className={styles.card}>
                  <a href={file.url} target="_blank" rel="noreferrer" className={styles.preview} aria-label={`Abrir ${file.name}`}>
                    {kind === "image" ? <img src={file.url} alt="" loading="lazy" /> : <Icon size={36} strokeWidth={1.3} aria-hidden="true" />}
                  </a>
                  <div className={styles.info}>
                    <a href={file.url} target="_blank" rel="noreferrer" className={styles.name} title={file.name}>{file.name}</a>
                    <span className={styles.meta}>
                      {PATIENT_FILE_TYPES[file.contentType] ?? "Archivo"} · {formatBytes(file.sizeBytes)}
                      {day ? ` · ${formatShortDate(day)}` : ""}
                    </span>
                  </div>
                  {canEdit ? (
                    <IconButton label={`Eliminar ${file.name}`} tone="danger" onClick={() => void remove(file)} className={styles.remove}>
                      <Trash2 size={16} aria-hidden="true" />
                    </IconButton>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </AsyncBoundary>

      <ComingSoonModal
        open={comingSoon}
        onClose={() => setComingSoon(false)}
        feature="Adjuntar archivos"
        message="Muy pronto vas a poder guardar fotos, radiografías, PDF y planillas en la ficha de cada paciente. Estamos terminando de prepararlo."
      />
    </Panel>
  );
};

export default PatientFiles;
