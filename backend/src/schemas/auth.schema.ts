import { z } from "zod";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  zFullName,
  zPhone,
} from "@odonto/shared";

export { changePasswordSchema, loginSchema, registerSchema };

export const refreshSchema = z.object({ refreshToken: z.string().min(1) });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const updateProfileSchema = z.object({
  fullName: zFullName.optional(),
  phone: zPhone.optional(),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
