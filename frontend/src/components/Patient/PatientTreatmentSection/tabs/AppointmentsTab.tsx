import { Pencil, Plus } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import DateBadge from "@/components/UI/DateBadge/DateBadge";
import IconButton from "@/components/UI/IconButton/IconButton";
import ItemList from "@/components/UI/ItemList/ItemList";
import Panel from "@/components/UI/Panel/Panel";
import { toCalendarDay } from "@/utils/calendar";
import type { PlannedAppointment } from "../types";

interface AppointmentsTabProps {
  isAdmin: boolean;
  appointments: PlannedAppointment[];
  onAdd: () => void;
  onEdit: (index: number) => void;
}

const AppointmentsTab = ({ isAdmin, appointments, onAdd, onEdit }: AppointmentsTabProps) => (
  <div id="panel-appointments" role="tabpanel">
    <Panel
      eyebrow="Agenda del tratamiento"
      title="Próximas visitas"
      action={
        isAdmin ? (
          <Button size="small" onClick={onAdd} icon={<Plus size={16} strokeWidth={1.8} aria-hidden="true" />}>
            Agregar visita
          </Button>
        ) : undefined
      }
    >
      <ItemList
        emptyMessage="No hay visitas planificadas."
        items={appointments.map((appointment, index) => ({
          key: `${appointment.type}-${appointment.date}-${index}`,
          leading: <DateBadge date={toCalendarDay(appointment.date)} />,
          title: appointment.type || "Visita",
          meta: [appointment.time && `${appointment.time} hs`, appointment.doctor].filter(Boolean).join(" · "),
          trailing: isAdmin ? (
            <IconButton label={`Editar ${appointment.type || "visita"}`} onClick={() => onEdit(index)}>
              <Pencil aria-hidden="true" />
            </IconButton>
          ) : undefined,
        }))}
      />
    </Panel>
  </div>
);

export default AppointmentsTab;
