import { useMemo, useState, type ReactNode } from "react"
import { Eye, Edit, Plus, Trash2, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { GENDER_LABEL, INSURANCE_LABEL, MAX_PAGE_SIZE, PATIENT_STATUS_LABEL, type PatientDto } from "@odonto/shared"
import DataTable from "../../DataTable/DataTable"
import Alert from "@/components/UI/Alert/Alert"
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary"
import Button from "@/components/UI/Button/Button"
import Chip from "@/components/UI/Chip/Chip"
import { useConfirm } from "@/components/UI/Confirm/confirmContext"
import DetailList from "@/components/UI/DetailList/DetailList"
import Modal from "@/components/UI/Modal/Modal"
import SearchInput from "@/components/UI/SearchInput/SearchInput"
import { ROUTES } from "@/constants"
import { useApi } from "@/hooks/useApi"
import { useWriteAction } from "@/hooks/useWriteAction"
import { patientsApi } from "@/services"
import { fromIsoDate } from "@/utils/calendar"
import { formatDateAR } from "@/utils/date"
import { normalizeText } from "@/utils/text"
import PatientFormModal from "./PatientFormModal"
import styles from "./AdminUsersSection.module.scss"

/** A table row: rendered cells plus the record they came from. */
interface PatientTableRow {
  id: string
  /** Kept so row actions get the real patient, not the rendered cells. */
  raw: PatientDto
  name: ReactNode
  dni: string
  phone: string
  insurance: string
  treatment: ReactNode
  history: ReactNode
}

const COLUMNS = [
  { key: "name", label: "Nombre" },
  { key: "dni", label: "DNI" },
  { key: "phone", label: "Teléfono" },
  { key: "insurance", label: "Obra social" },
  { key: "treatment", label: "Tratamiento actual" },
  { key: "history", label: "Historia clínica" },
] as const

/** Editing a patient, or adding one (`patient: null`). */
type Editor = { patient: PatientDto | null } | null

const AdminUsersSection = () => {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const { data, loading, error, reload } = useApi(() => patientsApi.list({ pageSize: MAX_PAGE_SIZE }), [])
  const { saving, actionError, setActionError, runWrite } = useWriteAction(reload)

  const [query, setQuery] = useState("")
  const [viewing, setViewing] = useState<PatientDto | null>(null)
  const [editor, setEditor] = useState<Editor>(null)

  const birth = fromIsoDate(viewing?.birthDate)
  const patients = useMemo(() => data?.items ?? [], [data])
  const filtered = useMemo(() => {
    const needle = normalizeText(query)
    if (!needle) return patients
    return patients.filter((p) =>
      normalizeText(`${p.fullName} ${p.dni} ${p.phone} ${p.email} ${INSURANCE_LABEL[p.insurance] ?? ""}`).includes(needle),
    )
  }, [patients, query])

  const link = (label: string, to: string) => (
    <button type="button" className={styles.linkCell} onClick={(e) => { e.stopPropagation(); navigate(to, { state: { mode: "admin" } }) }}>
      {label}
    </button>
  )

  const tableData: PatientTableRow[] = filtered.map((p) => ({
    id: p.id,
    raw: p,
    name: (
      <div className={styles.nameCell}>
        <span className={styles.avatar}><User size={18} /></span>
        <span className={styles.nameText}>{p.fullName}</span>
        {!p.uid ? <Chip size="small">Sin cuenta</Chip> : null}
        {p.status === "inactive" ? <Chip size="small">Inactivo</Chip> : null}
      </div>
    ),
    dni: p.dni,
    phone: p.phone,
    insurance: INSURANCE_LABEL[p.insurance] ?? p.insurance,
    treatment: link("Ir a tratamiento actual", ROUTES.admin.patientTreatment(p.id)),
    history: link("Ir a historia clínica", ROUTES.admin.patientHistory(p.id)),
  }))

  const openEditor = (patient: PatientDto | null) => {
    setActionError(null)
    setEditor({ patient })
  }

  const deactivate = async (p: PatientDto) => {
    // There is no hard delete: a patient's turnos and clinical history must
    // survive, so the account is deactivated instead.
    const accepted = await confirm({
      title: `¿Dar de baja a ${p.fullName}?`,
      message: "La cuenta queda inactiva. Sus turnos y su historia clínica se conservan.",
      confirmLabel: "Dar de baja",
      tone: "danger",
    })
    if (accepted) void runWrite(() => patientsApi.update(p.id, { status: "inactive" }), "No pudimos dar de baja al paciente")
  }

  const save = (values: Parameters<typeof patientsApi.create>[0]) => {
    const current = editor?.patient
    if (!current) return runWrite(() => patientsApi.create(values), "No pudimos agregar al paciente")
    const { fullName, phone, gender, birthDate, insurance } = values
    return runWrite(() => patientsApi.update(current.id, { fullName, phone, gender, birthDate, insurance }), "No pudimos guardar los cambios")
  }

  return (
    <section id="users" className={styles.section}>
      {actionError && !editor ? <Alert>{actionError}</Alert> : null}

      <div className={styles.headerLine}>
        <SearchInput label="Buscar por nombre, DNI, teléfono…" value={query} onChange={setQuery} />
        <Button onClick={() => openEditor(null)} icon={<Plus size={18} strokeWidth={1.8} aria-hidden="true" />}>
          Agregar paciente
        </Button>
      </div>

      <AsyncBoundary loading={loading} error={error} onRetry={reload} empty={patients.length === 0} emptyMessage="Todavía no hay pacientes. Agregá el primero con el botón de arriba.">
        <DataTable
          columns={COLUMNS}
          data={tableData}
          selectable
          actions={[
            { icon: <Eye />, label: "Ver", onClick: (row: PatientTableRow) => setViewing(row.raw) },
            { icon: <Edit />, label: "Editar", onClick: (row: PatientTableRow) => openEditor(row.raw) },
            { icon: <Trash2 />, label: "Dar de baja", onClick: (row: PatientTableRow) => void deactivate(row.raw) },
          ]}
        />
      </AsyncBoundary>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} eyebrow="Paciente" title={viewing?.fullName}>
        {viewing ? (
          <DetailList
            items={[
              { label: "DNI", value: viewing.dni },
              { label: "Teléfono", value: viewing.phone || "—" },
              { label: "Email", value: viewing.email || "—" },
              { label: "Nacimiento", value: birth ? formatDateAR(birth) : "—" },
              { label: "Género", value: GENDER_LABEL[viewing.gender] ?? "—" },
              { label: "Obra social", value: INSURANCE_LABEL[viewing.insurance] ?? "—" },
              { label: "Estado", value: PATIENT_STATUS_LABEL[viewing.status] },
              { label: "Cuenta", value: viewing.uid ? "Registrada" : "Sin cuenta (cargado por la clínica)" },
            ]}
          />
        ) : null}
      </Modal>

      <PatientFormModal
        open={Boolean(editor)}
        patient={editor?.patient}
        busy={saving}
        error={actionError}
        onClose={() => setEditor(null)}
        onSubmit={save}
      />
    </section>
  )
}

export default AdminUsersSection
