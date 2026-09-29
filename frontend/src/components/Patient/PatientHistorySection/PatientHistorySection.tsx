import { useMemo, useState } from "react";
import { CalendarDays, FileText, Paperclip, Plus } from "lucide-react";
import PatientPage from "@/components/DashboardLayout/PatientPage";
import StatsCard from "@/components/StatsCard/StatsCard";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import Chip from "@/components/UI/Chip/Chip";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Timeline from "@/components/UI/Timeline/Timeline";
import { toCalendarDay } from "@/utils/calendar";
import { formatShortDate } from "@/utils/date";
import { normalizeText } from "@/utils/text";
import AddEntryModal from "./modals/AddEntryModal";
import { usePatientHistory } from "./hooks/usePatientHistory";
import type { PatientHistoryProps } from "./types";
import styles from "./PatientHistorySection.module.scss";

const displayDate = (value: string) => {
  const day = toCalendarDay(value);
  return day ? formatShortDate(day) : value;
};

const PatientHistorySection = ({ isAdmin = false, patientName }: PatientHistoryProps) => {
  const history = usePatientHistory(isAdmin, patientName);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const visible = useMemo(() => {
    const needle = normalizeText(search);
    if (!needle) return history.entries;
    return history.entries.filter((entry) =>
      normalizeText(`${entry.title} ${entry.description} ${entry.notes ?? ""}`).includes(needle),
    );
  }, [history.entries, search]);

  // Records arrive newest first, so the first one is the most recent visit.
  const stats = [
    { label: "Consultas", value: history.entries.length, icon: FileText },
    { label: "Con documentos", value: history.entries.filter((e) => e.attachments.length > 0).length, icon: Paperclip },
    { label: "Última consulta", value: history.entries[0] ? displayDate(history.entries[0].date) : "—", icon: CalendarDays },
  ];

  return (
    <PatientPage isAdmin={isAdmin}>
      <div className={styles.page}>
        <AsyncBoundary loading={history.loading} error={history.error} onRetry={history.reload}>
          <p className={styles.lead}>
            Registro de consultas y procedimientos de <strong>{history.displayName}</strong>.
          </p>

          <div className={styles.stats}>
            {stats.map((stat) => (
              <StatsCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className={styles.toolbar}>
            <SearchInput label="Buscar en la historia clínica" value={search} onChange={setSearch} />
            {isAdmin ? (
              <Button onClick={() => setAddOpen(true)} icon={<Plus size={18} strokeWidth={1.8} aria-hidden="true" />}>
                Agregar consulta
              </Button>
            ) : null}
          </div>

          <Timeline
            emptyMessage={search ? "Ninguna consulta coincide con la búsqueda." : "Todavía no hay consultas registradas."}
            items={visible.map((entry) => ({
              key: entry.id,
              date: displayDate(entry.date),
              title: entry.title,
              children: (
                <>
                  <p>{entry.description}</p>
                  {entry.notes ? (
                    <p className={styles.notes}>
                      <strong>Notas del profesional</strong>
                      {entry.notes}
                    </p>
                  ) : null}
                  {entry.attachments.length > 0 ? (
                    <div className={styles.attachments}>
                      {entry.attachments.map((name) => (
                        <Chip key={name} size="small" icon={<Paperclip size={14} strokeWidth={1.7} aria-hidden="true" />}>
                          {name}
                        </Chip>
                      ))}
                    </div>
                  ) : null}
                </>
              ),
            }))}
          />

          <AddEntryModal
            open={addOpen}
            saving={history.saving}
            error={history.saveError}
            onClose={() => setAddOpen(false)}
            onSubmit={history.addEntry}
          />
        </AsyncBoundary>
      </div>
    </PatientPage>
  );
};

export default PatientHistorySection;
