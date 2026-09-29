import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/auth/useAuth";
import pfp from "@/assets/images/profile.webp";
import styles from "./AdminDashboard.module.scss";

/**
 * The admin shell. The route table itself lives in App.tsx, so the sections
 * stay lazy-loaded; this only renders the chrome around whichever one matched.
 */
const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      userRole="admin"
      userType="admin"
      userName={user?.fullName ?? "Administración"}
      userAvatar={user?.avatarUrl ?? pfp}
    >
      <div className={styles.wrapper}>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
