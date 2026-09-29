import { useState } from "react";
import type { SupportTicketDto } from "@odonto/shared";
import SupportShell from "@/components/Support/SupportShell";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import Chip from "@/components/UI/Chip/Chip";
import ItemList from "@/components/UI/ItemList/ItemList";
import Panel from "@/components/UI/Panel/Panel";
import Tabs from "@/components/UI/Tabs/Tabs";
import { ADMIN_SUPPORT_TOPICS } from "@/data/supportTopics";
import { useApi } from "@/hooks/useApi";
import { useWriteAction } from "@/hooks/useWriteAction";
import { supportApi } from "@/services";
import { toCalendarDay } from "@/utils/calendar";
import { formatShortDate } from "@/utils/date";
import styles from "@/components/Support/Support.module.scss";

type View = "open" | "closed" | "all";

const AdminSupport = () => {
  const { data, loading, error, reload } = useApi(() => supportApi.list(), []);
  const { actionError, runWrite } = useWriteAction(reload);
  const [view, setView] = useState<View>("open");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const tickets = data?.items ?? [];
  const visible = view === "all" ? tickets : tickets.filter((t) => t.status === view);

  const toggle = async (ticket: SupportTicketDto) => {
    setUpdatingId(ticket.id);
    await runWrite(
      () => supportApi.setStatus(ticket.id, ticket.status === "open" ? "closed" : "open"),
      "No pudimos actualizar la consulta",
    );
    setUpdatingId(null);
  };

  const tabs = [
    { id: "open" as const, label: "Abiertas", count: tickets.filter((t) => t.status === "open").length },
    { id: "closed" as const, label: "Cerradas", count: tickets.filter((t) => t.status === "closed").length },
    { id: "all" as const, label: "Todas", count: tickets.length },
  ];

  return (
    <SupportShell lead="Guías rápidas de cada sección del panel y las consultas que envían los pacientes." topics={ADMIN_SUPPORT_TOPICS}>
      <Panel eyebrow="Bandeja" title="Consultas de pacientes" action={<Tabs items={tabs} active={view} onChange={setView} label="Filtrar consultas" />}>
        {actionError ? <Alert>{actionError}</Alert> : null}
        <AsyncBoundary loading={loading} error={error} onRetry={reload}>
          <ItemList
            emptyMessage={view === "open" ? "No hay consultas abiertas." : "No hay consultas para mostrar."}
            items={visible.map((ticket) => {
              const day = toCalendarDay(ticket.createdAt);
              return {
                key: ticket.id,
                title: (
                  <span className={styles.ticketTitle}>
                    {ticket.subject}
                    <Chip size="small">{ticket.status === "open" ? "Abierta" : "Cerrada"}</Chip>
                  </span>
                ),
                meta: (
                  <span className={styles.ticketMeta}>
                    <span className={styles.ticketBody}>{ticket.body}</span>
                    {ticket.authorName}
                    {day ? ` · ${formatShortDate(day)}` : ""}
                  </span>
                ),
                trailing: (
                  <Button
                    variant={ticket.status === "open" ? "primary" : "secondary"}
                    size="small"
                    loading={updatingId === ticket.id}
                    onClick={() => void toggle(ticket)}
                  >
                    {ticket.status === "open" ? "Marcar resuelta" : "Reabrir"}
                  </Button>
                ),
              };
            })}
          />
        </AsyncBoundary>
      </Panel>
    </SupportShell>
  );
};

export default AdminSupport;
