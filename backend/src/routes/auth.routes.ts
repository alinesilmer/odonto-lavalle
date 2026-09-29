import { Router } from "express";
import { auth } from "../config/firebase.js";
import { asyncHandler } from "../lib/async.js";
import { notFound } from "../lib/errors.js";
import { validate } from "../middleware/validate.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  updateProfileSchema,
  type ChangePasswordBody,
  type LoginBody,
  type RegisterBody,
  type UpdateProfileBody,
} from "../schemas/auth.schema.js";
import {
  changePassword,
  loadAuthUser,
  registerPatient,
  toLoginResponse,
  updateProfile,
} from "../services/auth.service.js";
import { getPatientOrThrow } from "../services/patients.service.js";
import { refreshIdToken, sendPasswordReset, signInWithPassword } from "../services/identity.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await registerPatient(req.body as RegisterBody));
  }),
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as LoginBody;
    const signIn = await signInWithPassword(email, password);
    res.json(await toLoginResponse(signIn.localId, signIn));
  }),
);

authRouter.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body as { refreshToken: string };
    const refreshed = await refreshIdToken(refreshToken);

    res.json(
      await toLoginResponse(refreshed.user_id, {
        idToken: refreshed.id_token,
        refreshToken: refreshed.refresh_token,
        expiresIn: refreshed.expires_in,
      }),
    );
  }),
);

authRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    // Always 204, so the endpoint cannot be used to enumerate registered emails.
    try {
      await sendPasswordReset((req.body as { email: string }).email);
    } catch {
      /* swallowed on purpose */
    }
    res.status(204).end();
  }),
);

authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req, res) => {
    // Revokes every refresh token for the user, so other devices are signed out too.
    await auth.revokeRefreshTokens((req as AuthedRequest).user.uid);
    res.status(204).end();
  }),
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { uid, role } = (req as AuthedRequest).user;
    const user = await loadAuthUser(uid);

    if (role !== "patient") {
      res.json({ user });
      return;
    }

    const patient = await getPatientOrThrow(uid).catch(() => null);
    if (!patient) throw notFound("No encontramos tu ficha de paciente");
    res.json({ user, patient });
  }),
);

authRouter.patch(
  "/me",
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const { uid, role } = (req as AuthedRequest).user;
    res.json(await updateProfile(uid, role, req.body as UpdateProfileBody));
  }),
);

authRouter.post(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { uid, email } = (req as AuthedRequest).user;
    const { currentPassword, newPassword } = req.body as ChangePasswordBody;

    await changePassword(uid, email, currentPassword, newPassword);
    res.status(204).end();
  }),
);
