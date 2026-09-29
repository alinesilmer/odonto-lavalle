export interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  notes?: string;
  attachments: string[];
}

export interface NewHistoryEntry {
  date: string;
  title: string;
  diagnosis: string;
  medication: string;
  notes: string;
}

export const EMPTY_ENTRY: NewHistoryEntry = {
  date: "",
  title: "",
  diagnosis: "",
  medication: "",
  notes: "",
};

export interface PatientHistoryProps {
  isAdmin?: boolean;
  patientName?: string;
}
