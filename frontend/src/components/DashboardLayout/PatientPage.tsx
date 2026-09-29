import type { ReactNode } from "react";
import { useAuth } from "@/auth/useAuth";
import DashboardLayout from "./DashboardLayout";

interface PatientPageProps {
  /** Admins open these pages inside their own dashboard shell, so they get the content alone. */
  isAdmin?: boolean;
  children: ReactNode;
}

/** Frames a page shared by both dashboards: the patient's shell for patients, nothing extra for admins. */
const PatientPage = ({ isAdmin = false, children }: PatientPageProps) => {
  const { user } = useAuth();

  if (isAdmin) return <>{children}</>;

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={user?.fullName ?? "Usuario"}>
      {children}
    </DashboardLayout>
  );
};

export default PatientPage;
