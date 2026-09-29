import { CalendarDays, Clock, Filter, Plus } from "lucide-react";
import { APPOINTMENT_STATUSES, APPOINTMENT_STATUS_LABEL } from "@odonto/shared";
import Button from "@/components/UI/Button/Button";
import Chip from "@/components/UI/Chip/Chip";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Tabs from "@/components/UI/Tabs/Tabs";
import { ALL_MONTHS, MONTH_OPTIONS } from "@/data/calendarOptions";
import { EMPTY_FILTERS, type AppointmentFilters } from "./filters";
import styles from "./AdminAppointmentsSection.module.scss";

interface FilterToolbarProps {
  filters: AppointmentFilters;
  onChange: (filters: AppointmentFilters) => void;
  /** How many turnos each status tab would show with the other filters applied. */
  counts: Record<AppointmentFilters["status"], number>;
  onOpenFilters: () => void;
  onAdd: () => void;
}

const FilterToolbar = ({ filters, onChange, counts, onOpenFilters, onAdd }: FilterToolbarProps) => {
  const monthLabel = MONTH_OPTIONS.find((option) => option.value === filters.month)?.label ?? "Todos";

  const statusTabs = [
    { id: "all" as const, label: "Todos", count: counts.all },
    ...APPOINTMENT_STATUSES.map((status) => ({
      id: status,
      label: APPOINTMENT_STATUS_LABEL[status],
      count: counts[status],
    })),
  ];

  const hasExtraFilters = filters.month !== ALL_MONTHS || Boolean(filters.week) || Boolean(filters.hour);

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarTop}>
        <SearchInput
          label="Buscar por paciente o motivo"
          value={filters.search}
          onChange={(search) => onChange({ ...filters, search })}
        />
        <Button onClick={onAdd} icon={<Plus size={18} strokeWidth={1.8} aria-hidden="true" />}>
          Agregar turno
        </Button>
      </div>

      <div className={styles.toolbarBottom}>
        <Tabs
          items={statusTabs}
          active={filters.status}
          onChange={(status) => onChange({ ...filters, status })}
          label="Filtrar por estado"
        />

        <div className={styles.filterChips}>
          <Chip size="small" onClick={onOpenFilters} icon={<CalendarDays size={15} strokeWidth={1.7} aria-hidden="true" />}>
            Mes: {monthLabel}
          </Chip>
          <Chip size="small" onClick={onOpenFilters} icon={<Filter size={15} strokeWidth={1.7} aria-hidden="true" />}>
            Semana: {filters.week || "Todas"}
          </Chip>
          <Chip size="small" onClick={onOpenFilters} icon={<Clock size={15} strokeWidth={1.7} aria-hidden="true" />}>
            Hora: {filters.hour || "Todas"}
          </Chip>
          {hasExtraFilters ? (
            <Button
              variant="link"
              size="small"
              onClick={() => onChange({ ...EMPTY_FILTERS, status: filters.status, search: filters.search })}
            >
              Limpiar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;
