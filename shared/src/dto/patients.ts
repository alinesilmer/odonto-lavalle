import type { Gender, Insurance, PatientStatus } from "../enums";

export interface PatientDto {
  id: string;
  uid: string;
  fullName: string;
  dni: string;
  gender: Gender;
  email: string;
  phone: string;
  birthDate: string;
  insurance: Insurance;
  status: PatientStatus;
  avatarUrl?: string;
  lastVisitAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Fields a profile update may change. `status` is admin-only; the API ignores it otherwise. */
export type UpdateProfileRequest = Partial<
  Pick<PatientDto, "fullName" | "phone" | "insurance" | "gender" | "birthDate" | "status">
>;
