import type { AuthUser, LoginResponse, Role } from "@odonto/shared";
import { auth } from "../config/firebase.js";
import { conflict } from "../lib/errors.js";
import type { RegisterBody, UpdateProfileBody } from "../schemas/auth.schema.js";
import { invalidate } from "../lib/cache.js";
import { PATIENTS_CACHE, adoptClinicPatient, findByDni, patientsCol } from "./patients.service.js";
import { signInWithPassword } from "./identity.js";

/** Firebase's sign-in payload, shaped into the envelope the clients expect. */
export interface TokenPair {
  idToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export async function loadAuthUser(uid: string): Promise<AuthUser> {
  const record = await auth.getUser(uid);
  const role = (record.customClaims?.role as Role | undefined) ?? "patient";

  // Admins have no patient document; fall back to the Auth display name.
  let fullName = record.displayName ?? "";
  if (role === "patient") {
    const snap = await patientsCol().doc(uid).get();
    if (snap.exists) fullName = (snap.data() as { fullName: string }).fullName;
  }

  return {
    uid,
    email: record.email ?? "",
    fullName,
    role,
    avatarUrl: record.photoURL ?? undefined,
  };
}

export async function toLoginResponse(uid: string, tokens: TokenPair): Promise<LoginResponse> {
  return {
    user: await loadAuthUser(uid),
    token: tokens.idToken,
    refreshToken: tokens.refreshToken,
    expiresIn: Number(tokens.expiresIn),
  };
}

/** Creates the Auth user, their patient document, and signs them straight in. */
export async function registerPatient(body: RegisterBody): Promise<LoginResponse> {
  // A record the clinic created (no uid) is adopted by this account; one that
  // already belongs to an account is a duplicate.
  const existing = await findByDni(body.dni);
  if (existing?.uid) {
    throw conflict("Ya existe una cuenta con ese DNI", { dni: "Este DNI ya está registrado" });
  }

  let uid: string;
  try {
    const record = await auth.createUser({
      email: body.email,
      password: body.password,
      displayName: body.fullName,
    });
    uid = record.uid;
  } catch (err) {
    if ((err as { code?: string }).code === "auth/email-already-exists") {
      throw conflict("Ya existe una cuenta con ese email", {
        email: "Este email ya está registrado",
      });
    }
    throw err;
  }

  // The role lives in a custom claim so the API can trust it after token verification.
  await auth.setCustomUserClaims(uid, { role: "patient" });

  const now = new Date();
  const profile = {
    uid,
    fullName: body.fullName,
    dni: body.dni,
    gender: body.gender,
    email: body.email,
    phone: body.phone,
    birthDate: body.birthDate,
    insurance: body.insurance,
    status: "active",
  };
  if (existing) await adoptClinicPatient(existing.id, uid, profile);
  else await patientsCol().doc(uid).set({ ...profile, createdAt: now, updatedAt: now });
  invalidate(PATIENTS_CACHE);

  const signIn = await signInWithPassword(body.email, body.password);
  return toLoginResponse(uid, signIn);
}

export async function updateProfile(
  uid: string,
  role: Role,
  body: UpdateProfileBody,
): Promise<AuthUser> {
  if (body.fullName) await auth.updateUser(uid, { displayName: body.fullName });

  // A patient's name of record lives on their patient document too.
  if (role === "patient" && (body.fullName || body.phone)) {
    await patientsCol()
      .doc(uid)
      .update({ ...body, updatedAt: new Date() });
    invalidate(PATIENTS_CACHE);
  }

  return loadAuthUser(uid);
}

export async function changePassword(
  uid: string,
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  // Re-authenticate first, so a stolen ID token alone cannot lock the real
  // owner out of their account.
  try {
    await signInWithPassword(email, currentPassword);
  } catch {
    throw conflict("La contraseña actual no es correcta", {
      currentPassword: "La contraseña actual no es correcta",
    });
  }

  await auth.updateUser(uid, { password: newPassword });
  // Force other devices to sign in again with the new password.
  await auth.revokeRefreshTokens(uid);
}
