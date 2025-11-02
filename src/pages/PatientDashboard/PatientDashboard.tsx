"use client";

import { Outlet } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { patientTreatment } from "../../data/dashboardData";

const PatientShell = () => {
  const name = patientTreatment.patientName ?? "Usuario";
  return (
    <DashboardLayout userRole="patient" userType="patient" userName={name}>
      <Outlet />
    </DashboardLayout>
  );
};

export default PatientShell;
