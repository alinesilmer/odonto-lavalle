import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Alert from "@/components/UI/Alert/Alert";
import AsyncBoundary from "@/components/UI/AsyncBoundary/AsyncBoundary";
import { useConfirm } from "@/components/UI/Confirm/confirmContext";
import Button from "@/components/UI/Button/Button";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Tabs from "@/components/UI/Tabs/Tabs";
import AddReminderModal from "./AddReminderModal";
import ReminderRow from "./ReminderRow";
import { useReminders, type ReminderView } from "./useReminders";
import styles from "./AdminRemindersSection.module.scss";

const EMPTY_TEXT: Record<ReminderView, string> = {
  pending: "No tenés recordatorios pendientes.",
  done: "Todavía no marcaste recordatorios como hechos.",
  all: "No hay recordatorios.",
};

const AdminRemindersSection = () => {
  const reminders = useReminders();
  const confirm = useConfirm();
  const [addOpen, setAddOpen] = useState(false);

  const tabs = [
    { id: "pending" as const, label: "Pendientes", count: reminders.counts.pending },
    { id: "done" as const, label: "Hechos", count: reminders.counts.done },
    { id: "all" as const, label: "Todos", count: reminders.counts.all },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.toolbar}>
        <SearchInput label="Buscar recordatorios" value={reminders.search} onChange={reminders.setSearch} />
        <Tabs items={tabs} active={reminders.view} onChange={reminders.setView} label="Mostrar recordatorios" />
        <Button onClick={() => setAddOpen(true)} icon={<Plus size={18} strokeWidth={1.8} aria-hidden="true" />}>
          Agregar recordatorio
        </Button>
      </div>

      {reminders.actionError && !addOpen ? <Alert>{reminders.actionError}</Alert> : null}

      <AsyncBoundary
        loading={reminders.loading}
        error={reminders.error}
        onRetry={reminders.reload}
        empty={reminders.groups.length === 0}
        emptyMessage={EMPTY_TEXT[reminders.view]}
      >
        <div className={styles.groups}>
          {reminders.groups.map((group) => (
            <section key={group.id} className={styles.group} aria-labelledby={`group-${group.id}`}>
              <h3 id={`group-${group.id}`} className={`${styles.groupLabel} ${group.id === "overdue" ? styles.groupOverdue : ""}`}>
                {group.label}
                <span>{group.items.length}</span>
              </h3>
              <ul className={styles.list}>
                <AnimatePresence initial={false}>
                  {group.items.map((item, i) => (
                    <ReminderRow
                      key={item.id}
                      item={item}
                      index={i}
                      onToggle={() => void reminders.toggleDone(item)}
                      onRemove={async () => {
                        const accepted = await confirm({
                          title: "¿Eliminar este recordatorio?",
                          message: `"${item.title}" se va a borrar y no se puede recuperar.`,
                          confirmLabel: "Eliminar",
                          tone: "danger",
                        });
                        if (accepted) void reminders.remove(item);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))}
        </div>
      </AsyncBoundary>

      <AddReminderModal
        open={addOpen}
        saving={reminders.saving}
        error={reminders.actionError}
        onClose={() => setAddOpen(false)}
        onCreate={reminders.create}
      />
    </section>
  );
};

export default AdminRemindersSection;
