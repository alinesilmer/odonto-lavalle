import { useState, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Home,
  Calendar,
  FileText,
  Settings,
  MessageCircleQuestionMark,
  Users,
  Package,
  BarChart3,
  Bell,
  LayoutList,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react"
import Logo from "../../assets/images/Logo.webp"
import { useAuth } from "@/auth/useAuth"
import styles from "./Sidebar.module.scss"

interface SidebarProps {
  userType: "patient" | "admin"
  userName: string
  userRole: string
  userAvatar?: string
}

type MenuItem = { path: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }

const Sidebar = ({ userType, userName, userAvatar }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    // logout() clears the local session even if the server revoke fails.
    await logout()
    navigate("/login", { replace: true })
  }

  const patientMenuItems: MenuItem[] = [
    { path: "/dashboard/paciente", label: "Inicio", icon: Home },
    { path: "/dashboard/paciente/turnos", label: "Mis turnos", icon: Calendar },
    { path: "/dashboard/paciente/tratamiento", label: "Mi tratamiento", icon: FileText },
    { path: "/dashboard/paciente/historia", label: "Mi historia clínica", icon: FileText },
  ]

  const adminMenuItems: MenuItem[] = [
    { path: "/dashboard/admin", label: "Inicio", icon: Home },
    { path: "/dashboard/admin/turnos", label: "Turnos", icon: Calendar },
    { path: "/dashboard/admin/pacientes", label: "Pacientes", icon: Users },
    { path: "/dashboard/admin/stock", label: "Stock", icon: Package },
    { path: "/dashboard/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
    { path: "/dashboard/admin/recordatorios", label: "Recordatorios", icon: Bell },
    { path: "/dashboard/admin/contenido", label: "Contenido del sitio", icon: LayoutList },
  ]

  const configPath = userType === "patient" ? "/dashboard/paciente/configuracion" : "/dashboard/admin/configuracion"
  const supportPath = userType === "patient" ? "/dashboard/paciente/soporte" : "/dashboard/admin/soporte"

  const menuItems = userType === "patient" ? patientMenuItems : adminMenuItems

  const norm = (p: string) => p.replace(/\/+$/, "")
  const isActive = (p: string) => {
    const current = norm(location.pathname)
    const base = norm(p)
    return current === base || current.startsWith(base + "/")
  }

  const activePath = useMemo(() => {
    const current = norm(location.pathname)
    const candidate = menuItems
      .map(i => norm(i.path))
      .filter(p => current === p || current.startsWith(p + "/"))
      .sort((a, b) => b.length - a.length)[0]
    return candidate ?? current
  }, [location.pathname, menuItems])

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`} aria-label="Sidebar navegación">
      <div className={styles.inner}>
        <div className={styles.logo}>
          <div className={styles.logoLeft}>
            <div className={styles.logoIcon}>
              <img src={Logo} alt="Logo" />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>Lavalle</span>
              <span className={styles.logoSubtitle}>odontología</span>
            </div>
          </div>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(v => !v)}
            aria-label={collapsed ? "Expandir" : "Colapsar"}
            type="button"
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map(item => {
            const Icon = item.icon
            const active = norm(item.path) === activePath
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
                aria-current={active ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} strokeWidth={1.7} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.footer}>
          <Link
            to={configPath}
            className={`${styles.navItem} ${isActive(configPath) ? styles.active : ""}`}
            title={collapsed ? "Configuración" : undefined}
          >
            <Settings size={18} strokeWidth={1.7} />
            <span>Configuración</span>
          </Link>

          <Link
            to={supportPath}
            className={`${styles.navItem} ${isActive(supportPath) ? styles.active : ""}`}
            title={collapsed ? "Soporte" : undefined}
          >
            <MessageCircleQuestionMark size={18} strokeWidth={1.7} />
            <span>Soporte</span>
          </Link>

          <div className={styles.user}>
            <img
              src={
                userAvatar ||
                "https://imgs.search.brave.com/MOJNZZ7jZEobQ9JitvnpUAhqvxpu5zwiYbbnQxtiNQg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzlmLzRj/L2YwLzlmNGNmMGYy/NGIzNzYwNzdhMmZj/ZGFiMmU4NWMzNTg0/LmpwZw"
              }
              alt={userName}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
