"use client"

import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import Button from "@/components/UI/Button/Button"
import { adminReminders } from "../../../data/dashboardData"
import styles from "./AdminRemindersSection.module.scss"

const AdminRemindersSection = () => {
  return (
    <section id="reminders" className={styles.section}>
      <h2>RECORDATORIOS</h2>
      <div className={styles.list}>
        {adminReminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            className={styles.card}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.icon}>
              <Bell />
            </div>
            <div className={styles.content}>
              <h4>{reminder.title}</h4>
              <p>{reminder.description}</p>
              <span className={styles.date}>{reminder.time}</span>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" size="small">
                Filtrar
              </Button>
              <Button variant="primary" size="small">
                Editar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default AdminRemindersSection
