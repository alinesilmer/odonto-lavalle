/**
 * Content for the two dashboard landing pages.
 *
 * The activity feeds below are PLACEHOLDERS: there is no notifications
 * endpoint yet, so these items are static and do not reflect real data.
 */
import { Bell, Calendar, FileText, Settings, Users, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/constants";

export interface QuickAction {
  to: string;
  label: string;
  icon: LucideIcon;
}

export interface ActivityItem {
  icon: string;
  title: string;
  when: string;
}

export const ADMIN_QUICK_ACTIONS: QuickAction[] = [
  { to: ROUTES.admin.appointments, label: "Gestionar Turnos", icon: Calendar },
  { to: ROUTES.admin.patients, label: "Ver Pacientes", icon: Users },
  { to: ROUTES.admin.reminders, label: "Recordatorios", icon: Bell },
  { to: ROUTES.admin.config, label: "Configuración", icon: Settings },
];

export const PATIENT_QUICK_ACTIONS: QuickAction[] = [
  { to: ROUTES.patient.treatment, label: "Revisar Tratamiento", icon: FileText },
  { to: ROUTES.patient.appointments, label: "Ver Turnos", icon: Calendar },
];

export const ADMIN_ACTIVITY: ActivityItem[] = [
  { icon: "📅", title: "Nuevo turno agendado", when: "Hace 15 minutos" },
  { icon: "👤", title: "Paciente nuevo registrado", when: "Hace 1 hora" },
  { icon: "⚠️", title: "Turno cancelado", when: "Hace 3 horas" },
];

export const PATIENT_ACTIVITY: ActivityItem[] = [
  { icon: "📅", title: "Próximo turno confirmado", when: "16/12/2025" },
];
