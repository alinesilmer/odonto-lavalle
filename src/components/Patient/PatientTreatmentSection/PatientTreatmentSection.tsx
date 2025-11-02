"use client";

import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { patientTreatment } from "../../../data/dashboardData";
import styles from "./PatientTreatmentSection.module.scss";

const PatientTreatment = () => (
  <DashboardLayout userType="patient" userRole="patient" userName={patientTreatment.patientName ?? "Usuario"}>
    <div className={styles.wrap}>
      <section className={styles.section}>
        <h2>MI TRATAMIENTO ACTUAL</h2>
        <div className={styles.card}>
          <div className={styles.patientInfo}>
            <img src="https://i.pravatar.cc/150?img=12" alt="Paciente" />
            <div>
              <h3>{patientTreatment.patientName}</h3>
              <p>DNI: {patientTreatment.dni}</p>
              <p>Género: {patientTreatment.gender}</p>
            </div>
          </div>
          <div className={styles.metrics}>
            <div className={styles.metric}><h4>{patientTreatment.weight}</h4><p>Peso</p></div>
            <div className={styles.metric}><h4>{patientTreatment.age}</h4><p>Edad</p></div>
            <div className={styles.metric}><h4>{patientTreatment.bmi}</h4><p>IMC</p></div>
          </div>
          <div className={styles.detailsGrid}>
            <div>
              <h4>Condiciones</h4>
              <ul>
                {patientTreatment.conditions?.map((c, i)=>(
                  <li key={i}>{c.name}{c.diagnosis ? ` — ${c.diagnosis}`:""}{c.date?` (${c.date})`:""}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Medicaciones</h4>
              <ul>
                {patientTreatment.medications?.map((m, i)=>(
                  <li key={i}>{m.name}{m.dosage?` — ${m.dosage}`:""}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
);

export default PatientTreatment;
