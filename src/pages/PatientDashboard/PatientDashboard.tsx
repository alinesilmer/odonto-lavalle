"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  FileText,
  Eye,
  Download,
  X,
  Send,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import StatsCard from "../../components/StatsCard/StatsCard";
import DataTable from "../../components/DataTable/DataTable";
import Button from "../../components/Button/Button";
import ClinicHistory from "../../components/ClinicHistory/ClinicHistory";
import {
  patientAppointments,
  patientMessages,
  patientTreatment,
} from "../../data/dashboardData";
import styles from "./PatientDashboard.module.scss";

const PatientDashboard = () => {
  const [selectedMessage, setSelectedMessage] = useState(patientMessages[0]);
  const [messageText, setMessageText] = useState("");

  const appointmentColumns = [
    { key: "date", label: "Fecha" },
    { key: "time", label: "Hora" },
    { key: "reason", label: "Motivo" },
    { key: "insurance", label: "Obra Social" },
    { key: "payment", label: "Pago" },
    { key: "status", label: "Estado" },
  ];

  const appointmentStats = useMemo(() => {
    const completed = patientAppointments.filter(
      (a) => a.status === "Completado"
    ).length;
    const pending = patientAppointments.filter(
      (a) => a.status === "Pendiente"
    ).length;
    const cancelled = patientAppointments.filter(
      (a) => a.status === "Cancelado"
    ).length;
    return { completed, pending, cancelled };
  }, []);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log("[v0] Sending message:", messageText);
      setMessageText("");
    }
  };

  const messageList = patientMessages.map((m) => ({
    id: m.id,
    sender: m.sender,
    preview: m.text.length > 50 ? `${m.text.slice(0, 50)}…` : m.text,
    timestamp: m.timestamp,
    isOwn: m.isOwn,
    text: m.text,
    avatar: m.avatar,
  }));

  type TreatmentType = {
    history?: Array<{
      date?: string;
      condition: string;
      diagnosis?: string;
      medication?: string;
    }>;
    conditions?: Array<{ date?: string; name: string; diagnosis?: string }>;
    medications?: Array<{ name: string; dosage?: string }>;
    patientName?: string;
    dni?: string;
    gender?: string;
    weight?: string | number;
    age?: string | number;
    bmi?: string | number;
  };

  const treatment = patientTreatment as unknown as TreatmentType;

  const derivedHistory =
    treatment.history ??
    treatment.conditions?.map((c) => ({
      date: c.date ?? "-",
      condition: c.name,
      diagnosis: c.diagnosis ?? "-",
      medication: treatment.medications?.[0]?.name ?? "-",
    })) ??
    [];

  return (
    <DashboardLayout
      userRole="patient"
      userType="patient"
      userName={patientTreatment.patientName ?? "Usuario"}
    >
      <div className={styles.dashboard}>
        {/* Welcome + notifications */}
        <section className={styles.welcomeSection}>
          <motion.div
            className={styles.welcomeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.welcomeContent}>
              <h1>¡HOLA, USUARIO!</h1>
              <p>¿Qué vamos a hacer hoy?</p>
              <div className={styles.quickActions}>
                <button className={styles.actionBtn} type="button">
                  <FileText size={18} />
                  Revisar Tratamiento
                </button>
                <button className={styles.actionBtn} type="button">
                  <Calendar size={18} />
                  Ver Turnos
                </button>
                <button className={styles.actionBtn} type="button">
                  <MessageSquare size={18} />
                  Enviar Mensaje
                </button>
              </div>
            </div>
            <div className={styles.mascot}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-10-14%20122902-cdaCleHoiJHBG70cq1vB2UnPctp5XQ.png"
                alt="Tooth mascot"
              />
            </div>
          </motion.div>

          <motion.div
            className={styles.notifications}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>NOTIFICACIONES</h3>
            <div className={styles.notificationList}>
              <div className={styles.notification}>
                <div className={styles.notifIcon}>📅</div>
                <div>
                  <p className={styles.notifTitle}>Próximo turno confirmado</p>
                  <p className={styles.notifDate}>16/12/2025</p>
                </div>
              </div>
              <div className={styles.notification}>
                <div className={styles.notifIcon}>💬</div>
                <div>
                  <p className={styles.notifTitle}>Tienes un mensaje nuevo</p>
                  <p className={styles.notifDate}>Hace 2 horas</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Appointments */}
        <section className={styles.appointmentsSection}>
          <h2>MIS TURNOS</h2>
          <div className={styles.appointmentStats}>
            <StatsCard
              icon="calendar"
              value={appointmentStats.completed}
              label="Completados"
              color="success"
            />
            <StatsCard
              icon="calendar"
              value={appointmentStats.pending}
              label="Pendientes"
              color="info"
            />
            <StatsCard
              icon="calendar"
              value={appointmentStats.cancelled}
              label="Cancelados"
              color="danger"
            />
          </div>

          <DataTable
            columns={appointmentColumns}
            data={patientAppointments}
            actions={[
              {
                icon: <Eye />,
                label: "Ver",
                onClick: (row) => console.log("[v0] View:", row),
              },
              {
                icon: <Download />,
                label: "Descargar",
                onClick: (row) => console.log("[v0] Download:", row),
              },
              {
                icon: <X />,
                label: "Cancelar",
                onClick: (row) => console.log("[v0] Cancel:", row),
              },
            ]}
          />
        </section>

        {/* Messages */}
        <section className={styles.messagesSection}>
          <h2>MENSAJES</h2>
          <div className={styles.messageContainer}>
            <div className={styles.messageList}>
              {messageList.map((msg) => (
                <button
                  key={msg.id}
                  className={`${styles.messageItem} ${
                    selectedMessage.id === msg.id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedMessage(msg)}
                  type="button"
                >
                  <div className={styles.messageAvatar}>
                    {msg.sender?.[0] ?? "?"}
                  </div>
                  <div className={styles.messagePreview}>
                    <h4>{msg.sender}</h4>
                    <p>{msg.preview}</p>
                  </div>
                  <span className={styles.messageTime}>{msg.timestamp}</span>
                </button>
              ))}
            </div>

            <div className={styles.messageThread}>
              <div className={styles.threadHeader}>
                <h3>{selectedMessage.sender}</h3>
              </div>
              <div className={styles.threadMessages}>
                <div
                  className={`${styles.message} ${
                    selectedMessage.isOwn ? styles.own : ""
                  }`}
                >
                  <p>{selectedMessage.text}</p>
                  <span className={styles.timestamp}>
                    {selectedMessage.timestamp}
                  </span>
                </div>
              </div>
              <div className={styles.messageInput}>
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} type="button">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.treatmentSection}>
          <h2>MI TRATAMIENTO ACTUAL</h2>
          <div className={styles.treatmentCard}>
            <div className={styles.patientInfo}>
              <img src="https://i.pravatar.cc/150?img=12" alt="Patient" />
              <div>
                <h3>{patientTreatment.patientName}</h3>
                <p>DNI: {patientTreatment.dni}</p>
                <p>Género: {patientTreatment.gender}</p>
              </div>
            </div>

            <div className={styles.healthMetrics}>
              <div className={styles.metric}>
                <h4>{patientTreatment.weight}</h4>
                <p>Peso</p>
              </div>
              <div className={styles.metric}>
                <h4>{patientTreatment.age}</h4>
                <p>Edad</p>
              </div>
              <div className={styles.metric}>
                <h4>{patientTreatment.bmi}</h4>
                <p>IMC</p>
              </div>
            </div>

            <div className={styles.treatmentDetails}>
              <div className={styles.detailsGrid}>
                <div>
                  <h4>Condiciones</h4>
                  <ul>
                    {patientTreatment.conditions?.map((c, idx) => (
                      <li key={idx}>
                        {c.name}
                        {c.diagnosis ? ` — ${c.diagnosis}` : ""}
                        {c.date ? ` (${c.date})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>Medicaciones</h4>
                  <ul>
                    {patientTreatment.medications?.map((m, idx) => (
                      <li key={idx}>
                        {m.name}
                        {m.dosage ? ` — ${m.dosage}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ClinicHistory records={derivedHistory} />
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
