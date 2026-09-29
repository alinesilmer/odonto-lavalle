import DashboardHome from "@/components/DashboardHome/DashboardHome";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { useAuth } from "@/auth/useAuth";
import { PATIENT_ACTIVITY, PATIENT_QUICK_ACTIONS } from "@/data/dashboardHome";
import styles from "./PatientHome.module.scss";

const PatientHome = () => {
  const { user } = useAuth();
  const fullName = user?.fullName ?? "Usuario";
  const firstName = fullName.split(" ")[0];

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={fullName}>
      <div className={styles.wrap}>
        <DashboardHome
          greeting={`¡HOLA, ${firstName.toUpperCase()}!`}
          subtitle="¿Qué vamos a hacer hoy?"
          actions={PATIENT_QUICK_ACTIONS}
          activityTitle="NOTIFICACIONES"
          activity={PATIENT_ACTIVITY}
        />
      </div>
    </DashboardLayout>
  );
};

export default PatientHome;
