import { useMemo } from "react";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import Button from "@/components/UI/Button/Button";
import Panel from "@/components/UI/Panel/Panel";
import ItemList from "@/components/UI/ItemList/ItemList";
import StatusChip from "@/components/UI/StatusChip/StatusChip";
import { ROUTES } from "@/constants";
import { useApi } from "@/hooks/useApi";
import { appointmentsApi } from "@/services";
import { MAX_PAGE_SIZE } from "@odonto/shared";
import { clinicToday, toApiTimestamp, toFormFields } from "@/utils/clinicTime";

/** Today's appointments in time order; only today's day is fetched, not the whole agenda. */
const TodayAgenda = () => {
  const { data, loading, error, reload } = useApi(() => {
    const date = clinicToday();
    return appointmentsApi.list({
      from: toApiTimestamp(date, "00:00"),
      to: toApiTimestamp(date, "23:59"),
      pageSize: MAX_PAGE_SIZE,
    });
  }, []);

  const today = useMemo(() => {
    const date = clinicToday();
    return (data?.items ?? [])
      .map((item) => ({ ...item, ...toFormFields(item.startsAt) }))
      .filter((item) => item.date === date) // the demo API ignores from/to
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [data]);

  return (
    <Panel
      eyebrow="Agenda"
      title="Turnos de hoy"
      action={
        <Button to={ROUTES.admin.appointments} variant="link" size="small" arrow>
          Ver todos
        </Button>
      }
    >
      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={reload}
        empty={today.length === 0}
        emptyMessage="No hay turnos para hoy."
      >
        <ItemList
          items={today.map((item) => ({
            key: item.id,
            leading: item.time,
            title: item.patientName,
            meta: item.reason,
            trailing: <StatusChip status={item.status} />,
          }))}
        />
      </AsyncBoundary>
    </Panel>
  );
};

export default TodayAgenda;
