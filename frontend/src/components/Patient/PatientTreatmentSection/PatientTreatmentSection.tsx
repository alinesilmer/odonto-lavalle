import PatientPage from "@/components/DashboardLayout/PatientPage";
import TreatmentContent from "./TreatmentContent";
import type { PatientTreatmentProps } from "./types";

const PatientTreatmentSection = ({ isAdmin = false }: PatientTreatmentProps) => (
  <PatientPage isAdmin={isAdmin}>
    <TreatmentContent isAdmin={isAdmin} />
  </PatientPage>
);

export default PatientTreatmentSection;
