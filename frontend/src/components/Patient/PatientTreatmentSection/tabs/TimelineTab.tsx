import { Pencil, Plus } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import Chip from "@/components/UI/Chip/Chip";
import IconButton from "@/components/UI/IconButton/IconButton";
import Panel from "@/components/UI/Panel/Panel";
import Timeline from "@/components/UI/Timeline/Timeline";
import { toCalendarDay } from "@/utils/calendar";
import { formatShortDate } from "@/utils/date";
import { TIMELINE_STATUS_LABEL } from "../labels";
import type { TimelineEntry, TimelineStatus } from "../types";

interface TimelineTabProps {
  isAdmin: boolean;
  entries: TimelineEntry[];
  onAdd: () => void;
  onEdit: (index: number) => void;
}

const STATE: Record<TimelineStatus, "done" | "current" | "upcoming"> = {
  completed: "done",
  "in-progress": "current",
  scheduled: "upcoming",
};

const TimelineTab = ({ isAdmin, entries, onAdd, onEdit }: TimelineTabProps) => (
  <div id="panel-timeline" role="tabpanel">
    <Panel
      eyebrow="Recorrido"
      title="Evolución del tratamiento"
      action={
        isAdmin ? (
          <Button size="small" onClick={onAdd} icon={<Plus size={16} strokeWidth={1.8} aria-hidden="true" />}>
            Agregar etapa
          </Button>
        ) : undefined
      }
    >
      <Timeline
        emptyMessage="Todavía no hay etapas registradas."
        items={entries.map((entry, index) => {
          const day = toCalendarDay(entry.date);
          return {
            key: `${entry.title}-${entry.date}-${index}`,
            date: day ? formatShortDate(day) : "Sin fecha",
            title: entry.title,
            state: STATE[entry.status],
            aside: (
              <>
                <Chip size="small">{TIMELINE_STATUS_LABEL[entry.status]}</Chip>
                {isAdmin ? (
                  <IconButton label={`Editar ${entry.title}`} onClick={() => onEdit(index)}>
                    <Pencil aria-hidden="true" />
                  </IconButton>
                ) : null}
              </>
            ),
            children: entry.description ? <p>{entry.description}</p> : undefined,
          };
        })}
      />
    </Panel>
  </div>
);

export default TimelineTab;
