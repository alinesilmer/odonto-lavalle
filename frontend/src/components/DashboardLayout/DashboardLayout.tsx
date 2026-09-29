import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { formatLongDate } from "@/utils/date";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./DashboardLayout.module.scss";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "patient" | "admin";
  userName: string;
  userRole: string;
  userAvatar?: string;
}

const ADMIN_TITLES: Record<string, string> = {
  "": "Tablero general",
  turnos: "Turnos",
  pacientes: "Pacientes",
  stock: "Stock",
  estadisticas: "Estadísticas",
  recordatorios: "Recordatorios",
  contenido: "Contenido del sitio",
  pagos: "Pagos",
  configuracion: "Configuración",
  soporte: "Soporte",
};

const PATIENT_TITLES: Record<string, string> = {
  "": "Inicio",
  inicio: "Inicio",
  turnos: "Mis turnos",
  tratamiento: "Mi tratamiento",
  historia: "Mi historia clínica",
  configuracion: "Configuración",
  soporte: "Soporte",
};

const DashboardLayout = ({ children, userType, userName, userRole, userAvatar }: DashboardLayoutProps) => {
  const { pathname } = useLocation();
  const section = pathname.replace(/\/+$/, "").split("/")[3] ?? "";
  const titles = userType === "admin" ? ADMIN_TITLES : PATIENT_TITLES;
  const title = titles[section] ?? titles[""];

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar userType={userType} userName={userName} userRole={userRole} userAvatar={userAvatar} />
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.crumb}>
              {userType === "admin" ? "Panel de administración" : "Mi panel"}
            </p>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
          <p className={styles.date}>{formatLongDate(new Date())}</p>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
