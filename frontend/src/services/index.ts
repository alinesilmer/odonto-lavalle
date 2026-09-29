import type {
  AppointmentDto,
  AuthUser,
  AvailabilityResponse,
  ContactRequest,
  ContentInput,
  ContentKind,
  ContentMap,
  CreatePatientRequest,
  CreateAppointmentRequest,
  CreateHistoryRecordRequest,
  HistoryRecordDto,
  LoginRequest,
  LoginResponse,
  Page,
  PatientDto,
  PatientFileDto,
  RegisterRequest,
  SiteSettingsDto,
  ReminderDto,
  StatsChartsDto,
  StatsSummaryDto,
  StockItemDto,
  SupportTicketDto,
  SupportTicketRequest,
  TreatmentDto,
  UpdateTreatmentRequest,
  UpdateAppointmentRequest,
  UpdateProfileRequest,
  UpsertReminderRequest,
  UpsertStockItemRequest,
} from "@odonto/shared";
import { api } from "./http";

const qs = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
};

export const authApi = {
  login: (body: LoginRequest) => api.post<LoginResponse>("/auth/login", body, { anonymous: true }),
  register: (body: RegisterRequest) => api.post<LoginResponse>("/auth/register", body, { anonymous: true }),
  logout: () => api.post<void>("/auth/logout"),
  me: () => api.get<{ user: AuthUser; patient?: PatientDto }>("/auth/me"),
  forgotPassword: (email: string) =>
    api.post<void>("/auth/forgot-password", { email }, { anonymous: true }),
  updateProfile: (body: { fullName?: string; phone?: string }) =>
    api.patch<AuthUser>("/auth/me", body),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api.post<void>("/auth/change-password", body),
};

export const appointmentsApi = {
  availability: (date: string) =>
    api.get<AvailabilityResponse>(`/appointments/availability${qs({ date })}`, { anonymous: true }),
  list: (params: { status?: string; from?: string; to?: string; page?: number; pageSize?: number } = {}) =>
    api.get<Page<AppointmentDto>>(`/appointments${qs(params)}`),
  create: (body: CreateAppointmentRequest) => api.post<AppointmentDto>("/appointments", body),
  update: (id: string, body: UpdateAppointmentRequest) =>
    api.patch<AppointmentDto>(`/appointments/${id}`, body),
  cancel: (id: string) => api.patch<AppointmentDto>(`/appointments/${id}`, { status: "cancelled" }),
  remove: (id: string) => api.delete<void>(`/appointments/${id}`),
};

export const patientsApi = {
  list: (params: { search?: string; page?: number; pageSize?: number } = {}) =>
    api.get<Page<PatientDto>>(`/patients${qs(params)}`),
  get: (id: string) => api.get<PatientDto>(`/patients/${id}`),
  create: (body: CreatePatientRequest) => api.post<PatientDto>("/patients", body),
  update: (id: string, body: UpdateProfileRequest) => api.patch<PatientDto>(`/patients/${id}`, body),
};

export const historyApi = {
  list: (patientId: string) => api.get<{ items: HistoryRecordDto[] }>(`/patients/${patientId}/history`),
  create: (patientId: string, body: CreateHistoryRecordRequest) =>
    api.post<HistoryRecordDto>(`/patients/${patientId}/history`, body),
  remove: (patientId: string, recordId: string) =>
    api.delete<void>(`/patients/${patientId}/history/${recordId}`),
};

/** Attachments on a patient record (photos, X-rays, PDFs, spreadsheets…). */
export const filesApi = {
  list: (patientId: string) => api.get<{ items: PatientFileDto[] }>(`/patients/${patientId}/files`),
  upload: (patientId: string, file: File, note = "") =>
    api.post<PatientFileDto>(`/patients/${patientId}/files`, file, {
      headers: { "X-File-Name": encodeURIComponent(file.name), "X-File-Note": encodeURIComponent(note) },
    }),
  remove: (patientId: string, fileId: string) => api.delete<void>(`/patients/${patientId}/files/${fileId}`),
};

export const stockApi = {
  list: () => api.get<{ items: StockItemDto[] }>("/stock"),
  create: (body: UpsertStockItemRequest) => api.post<StockItemDto>("/stock", body),
  update: (id: string, body: UpsertStockItemRequest) => api.put<StockItemDto>(`/stock/${id}`, body),
  remove: (id: string) => api.delete<void>(`/stock/${id}`),
};

export const remindersApi = {
  list: () => api.get<{ items: ReminderDto[] }>("/reminders"),
  create: (body: UpsertReminderRequest) => api.post<ReminderDto>("/reminders", body),
  update: (id: string, body: Partial<UpsertReminderRequest>) =>
    api.patch<ReminderDto>(`/reminders/${id}`, body),
  remove: (id: string) => api.delete<void>(`/reminders/${id}`),
};

export const treatmentApi = {
  get: (patientId: string) => api.get<TreatmentDto>(`/patients/${patientId}/treatment`),
  update: (patientId: string, body: UpdateTreatmentRequest) =>
    api.put<void>(`/patients/${patientId}/treatment`, body),
};

export const supportApi = {
  list: () => api.get<{ items: SupportTicketDto[] }>("/support"),
  create: (body: SupportTicketRequest) => api.post<SupportTicketDto>("/support", body),
  setStatus: (id: string, status: "open" | "closed") =>
    api.patch<SupportTicketDto>(`/support/${id}`, { status }),
};

export const statsApi = {
  summary: () => api.get<StatsSummaryDto>("/stats/summary"),
  charts: () => api.get<StatsChartsDto>("/stats/charts"),
};

/** Website content (FAQ, services, obras sociales): public to read, admin to change. */
export const contentApi = {
  list: <K extends ContentKind>(kind: K) =>
    api.get<{ items: ContentMap[K][] }>(`/content/${kind}`, { anonymous: true }),
  create: <K extends ContentKind>(kind: K, body: ContentInput<K>) =>
    api.post<ContentMap[K]>(`/content/${kind}`, body),
  update: <K extends ContentKind>(kind: K, id: string, body: Partial<ContentInput<K>>) =>
    api.patch<ContentMap[K]>(`/content/${kind}/${id}`, body),
  remove: (kind: ContentKind, id: string) => api.delete<void>(`/content/${kind}/${id}`),
};

export const settingsApi = {
  get: () => api.get<SiteSettingsDto>("/settings", { anonymous: true }),
  update: (body: Partial<SiteSettingsDto>) => api.put<SiteSettingsDto>("/settings", body),
};

export const publicApi = {
  contact: (body: ContactRequest) => api.post<{ ok: true }>("/public/contact", body, { anonymous: true }),
  newsletter: (email: string) =>
    api.post<{ ok: true }>("/public/newsletter", { email }, { anonymous: true }),
  message: (message: string) =>
    api.post<{ ok: true }>("/public/message", { message }, { anonymous: true }),
};
