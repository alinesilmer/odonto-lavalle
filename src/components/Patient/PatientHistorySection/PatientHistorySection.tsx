// src/pages/Patient/PatientHistory.tsx
"use client";

import ClinicHistory from "@/components/ClinicHistory/ClinicHistory";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { patientTreatment } from "../../../data/dashboardData";
import styles from "./PatientHistorySection.module.scss";

type HistoryRecord = { date?: string; condition: string; diagnosis?: string; medication?: string };

function hasHistory(t: unknown): t is { history: HistoryRecord[] } {
  return !!t && typeof t === "object" && "history" in (t as any) && Array.isArray((t as any).history);
}

const derivedHistory: HistoryRecord[] =
  hasHistory(patientTreatment)
    ? (patientTreatment as any).history
    : patientTreatment.conditions?.map(c => ({
        date: c.date ?? "-",
        condition: c.name,
        diagnosis: c.diagnosis ?? "-",
        medication: patientTreatment.medications?.[0]?.name ?? "-",
      })) ?? [];

const PatientHistory = () => (
  <DashboardLayout userType="patient" userRole="patient" userName={patientTreatment.patientName ?? "Usuario"}>
    <div className={styles.wrap}>
      <section className={styles.section}>
        <h2>HISTORIA CLÍNICA</h2>
        <ClinicHistory records={derivedHistory} />
      </section>
    </div>
  </DashboardLayout>
);

export default PatientHistory;
