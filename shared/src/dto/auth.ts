import type { Gender, Insurance, Role } from "../enums";

export interface AuthUser {
  uid: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  /** Firebase ID token. Short-lived; refresh with refreshToken. */
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  fullName: string;
  dni: string;
  gender: Gender;
  email: string;
  phone: string;
  /** ISO date, "1990-05-21". */
  birthDate: string;
  password: string;
  insurance: Insurance;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
