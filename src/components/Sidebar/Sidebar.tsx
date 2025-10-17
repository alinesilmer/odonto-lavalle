import { Link, useLocation } from "react-router-dom"
import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  Package,
  BarChart3,
  Bell,
  DollarSign,
} from "lucide-react"
import styles from "./Sidebar.module.scss"

interface SidebarProps {
  userType: "patient" | "admin"
  userName: string
  userRole: string
  userAvatar?: string
}

const Sidebar = ({ userType, userName, userRole, userAvatar }: SidebarProps) => {
  const location = useLocation()

  const patientMenuItems = [
    { path: "/dashboard/paciente", label: "Inicio", icon: Home },
    { path: "/dashboard/paciente/turnos", label: "Mis Turnos", icon: Calendar },
    { path: "/dashboard/paciente/tratamiento", label: "Mi Tratamiento Actual", icon: FileText },
    { path: "/dashboard/paciente/historia", label: "Mi Historia Clínica", icon: FileText },
    { path: "/dashboard/paciente/mensajes", label: "Mensajes", icon: MessageSquare },
  ]

  const adminMenuItems = [
    { path: "/dashboard/admin", label: "Home", icon: Home },
    { path: "/dashboard/admin/turnos", label: "Turnos", icon: Calendar },
    { path: "/dashboard/admin/pacientes", label: "Lista de Pacientes", icon: Users },
    { path: "/dashboard/admin/stock", label: "Gestión de Stock", icon: Package },
    { path: "/dashboard/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
    { path: "/dashboard/admin/recordatorios", label: "Recordatorios", icon: Bell },
    { path: "/dashboard/admin/mensajes", label: "Mensajes", icon: MessageSquare },
    { path: "/dashboard/admin/pagos", label: "Pagos", icon: DollarSign },
  ]

  const menuItems = userType === "patient" ? patientMenuItems : adminMenuItems

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 50 50" fill="none">
            <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" />
            <path d="M15 25 Q20 30, 25 25 T35 25" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>LAVALLE</span>
          <span className={styles.logoSubtitle}>ODONTOLOGÍA</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.navItem}>
          <Settings size={20} />
          <span>Configuración</span>
        </button>
        <button className={styles.navItem}>
          <LogOut size={20} />
          <span>Soporte</span>
        </button>

        <div className={styles.user}>
          <img src={userAvatar || "/placeholder.svg?height=40&width=40"} alt={userName} className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
