import Button from "@/components/UI/Button/Button";
import DatePicker from "@/components/UI/DatePicker/DatePicker";
import Modal from "@/components/UI/Modal/Modal";
import Select from "@/components/UI/Select/Select";
import TimePicker from "@/components/UI/TimePicker/TimePicker";
import { MONTH_OPTIONS } from "@/data/calendarOptions";
import { fromIsoDate, fromIsoWeek, toIsoWeek } from "@/utils/calendar";
import { toIsoDate } from "@/utils/date";
import { EMPTY_FILTERS, type AppointmentFilters } from "../filters";

interface FiltersModalProps {
  open: boolean;
  filters: AppointmentFilters;
  onChange: (filters: AppointmentFilters) => void;
  onClose: () => void;
}

const FiltersModal = ({ open, filters, onChange, onClose }: FiltersModalProps) => {
  const weekStart = filters.week ? fromIsoWeek(filters.week) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      eyebrow="Turnos"
      title="Filtros"
      footer={
        <>
          <Button
            variant="link"
            size="small"
            onClick={() => onChange({ ...EMPTY_FILTERS, status: filters.status, search: filters.search })}
          >
            Limpiar filtros
          </Button>
          <Button size="small" onClick={onClose}>
            Ver resultados
          </Button>
        </>
      }
    >
      <Select
        label="Mes"
        name="month"
        value={filters.month}
        onChange={(month) => onChange({ ...filters, month })}
        options={MONTH_OPTIONS}
      />
      <DatePicker
        name="week"
        label="Semana"
        mode="week"
        placeholder="Todas las semanas"
        clearable
        value={weekStart ? toIsoDate(weekStart) : ""}
        onChange={(iso) => onChange({ ...filters, week: iso ? toIsoWeek(fromIsoDate(iso)!) : "" })}
      />
      <TimePicker
        name="hour"
        label="Hora"
        placeholder="Todas las horas"
        clearable
        value={filters.hour}
        onChange={(hour) => onChange({ ...filters, hour })}
      />
    </Modal>
  );
};

export default FiltersModal;
