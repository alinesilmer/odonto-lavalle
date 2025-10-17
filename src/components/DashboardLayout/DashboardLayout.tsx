import type { ReactNode } from "react"
import Sidebar from "../Sidebar/Sidebar"
import styles from "./DashboardLayout.module.scss"

interface DashboardLayoutProps {
  children: ReactNode
  userType: "patient" | "admin"
  userName: string
  userRole: string
  userAvatar?: string
}

const DashboardLayout = ({ children, userType, userName, userRole, userAvatar }: DashboardLayoutProps) => {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar userType={userType} userName={userName} userRole={userRole} userAvatar={userAvatar} />
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}

export default DashboardLayout
