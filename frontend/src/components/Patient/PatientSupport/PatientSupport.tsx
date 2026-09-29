import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import PatientPage from "@/components/DashboardLayout/PatientPage";
import SupportShell from "@/components/Support/SupportShell";
import Alert from "@/components/UI/Alert/Alert";
import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";
import Panel from "@/components/UI/Panel/Panel";
import Textarea from "@/components/UI/Textarea/Textarea";
import { PATIENT_SUPPORT_TOPICS } from "@/data/supportTopics";
import { useWriteAction } from "@/hooks/useWriteAction";
import { supportApi } from "@/services";
import styles from "@/components/Support/Support.module.scss";

const EMPTY_TICKET = { subject: "", body: "" };

const PatientSupport = () => {
  const [ticket, setTicket] = useState(EMPTY_TICKET);
  const [sent, setSent] = useState(false);
  const { saving, actionError, runWrite } = useWriteAction(() => undefined);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSent(false);
    if (await runWrite(() => supportApi.create(ticket), "No pudimos enviar tu consulta")) {
      setTicket(EMPTY_TICKET);
      setSent(true);
    }
  };

  return (
    <PatientPage>
      <SupportShell lead="Elegí un tema para ver cómo hacerlo paso a paso." topics={PATIENT_SUPPORT_TOPICS}>
        <Panel eyebrow="Contacto" title="¿No encontraste lo que buscabas?">
          <form className={styles.form} onSubmit={submit}>
            <p className={styles.hint}>Escribinos y el equipo te responde por este mismo canal.</p>
            {actionError ? <Alert>{actionError}</Alert> : null}
            {sent ? <Alert tone="success">¡Listo! Recibimos tu consulta.</Alert> : null}
            <Input
              name="subject"
              label="Asunto"
              required
              minLength={3}
              placeholder="Ej: No puedo cancelar un turno"
              value={ticket.subject}
              onChange={(e) => setTicket((prev) => ({ ...prev, subject: e.target.value }))}
            />
            <Textarea
              name="body"
              label="Contanos qué pasó"
              required
              minLength={5}
              rows={4}
              value={ticket.body}
              onChange={(e) => setTicket((prev) => ({ ...prev, body: e.target.value }))}
            />
            <Button type="submit" loading={saving} icon={<Send size={16} strokeWidth={1.7} aria-hidden="true" />} className={styles.submit}>
              {saving ? "Enviando..." : "Enviar consulta"}
            </Button>
          </form>
        </Panel>
      </SupportShell>
    </PatientPage>
  );
};

export default PatientSupport;
