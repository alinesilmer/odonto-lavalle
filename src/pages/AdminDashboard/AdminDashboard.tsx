"use client"

import { Routes, Route, Navigate } from "react-router-dom"

import DashboardLayout from "../../components/DashboardLayout/DashboardLayout"
import AdminStatsSection from "@/components/Admin/AdminStatsSection/AdminStatsSection"
import AdminAppointmentsSection from "@/components/Admin/AdminAppointmentSection/AdminAppointmentsSection"
import AdminUsersSection from "@/components/Admin/AdminUsersSection/AdminUsersSection"
import AdminStockSection from "@/components/Admin/AdminStockSection/AdminStockSection"
import AdminChartsSection from "@/components/Admin/AdminChartsSection/AdminChartsSection"
import AdminRemindersSection from "@/components/Admin/AdminRemindersSection/AdminRemindersSection"
import pfp from "../../assets/images/profile.png";
import styles from "./AdminDashboard.module.scss"

const AdminDashboard = () => {
  return (
    <DashboardLayout userRole="admin" userType="admin" userName="Paula Cavaglia" userAvatar={pfp}>
      <div className={styles.wrapper}>
        <main className={styles.content}>
          <Routes>
            <Route index element={<AdminStatsSection />} />

            <Route path="turnos" element={<AdminAppointmentsSection />} />
            <Route path="pacientes" element={<AdminUsersSection />} />
            <Route path="stock" element={<AdminStockSection />} />
            <Route path="estadisticas" element={<AdminChartsSection />} />
            <Route path="recordatorios" element={<AdminRemindersSection />} />

            <Route path="mensajes" element={<div>Mensajes (WIP)</div>} />
            <Route path="pagos" element={<div>Pagos (WIP)</div>} />

            <Route path="*" element={<Navigate to="." replace />} />
          </Routes>
        </main>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
