"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Calendar, MessageSquare, FileText } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout"
import { patientTreatment } from "../../../data/dashboardData"
import styles from "./PatientHome.module.scss"
import tooth from "../../../assets/images/tooth.png"

const PatientHome = () => (
  <DashboardLayout userType="patient" userRole="patient" userName={patientTreatment.patientName ?? "Usuario"}>
    <div className={styles.wrap}>
      <section className={styles.welcomeSection}>
        <motion.div className={styles.welcomeCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.welcomeContent}>
            <h1>¡HOLA, {patientTreatment.patientName ?? "USUARIO"}!</h1>
            <p>¿Qué vamos a hacer hoy?</p>
            <div className={styles.quickActions}>
              <Link to="/dashboard/paciente/tratamiento">
                <FileText size={18} />
                Revisar Tratamiento
              </Link>
              <Link to="/dashboard/paciente/turnos">
                <Calendar size={18} />
                Ver Turnos
              </Link>
              <Link to="/dashboard/paciente/mensajes">
                <MessageSquare size={18} />
                Enviar Mensaje
              </Link>
            </div>
          </div>
          <div className={styles.mascot}>
            <img src={tooth} alt="Mascota" />
          </div>
        </motion.div>

        <motion.div className={styles.notifications} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                <p className={styles.notifTitle}>Tenés un mensaje nuevo</p>
                <p className={styles.notifDate}>Hace 2 horas</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  </DashboardLayout>
)

export default PatientHome
