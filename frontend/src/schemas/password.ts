import { MIN_PASSWORD_LENGTH } from "@odonto/shared";

export type PasswordStrength = {
  /** 1 weak, 2 medium, 3 strong. */
  level: 1 | 2 | 3;
  label: string;
  /** A design token, so the meter matches the rest of the palette. */
  color: string;
};

const RULES = [
  (p: string) => p.length >= MIN_PASSWORD_LENGTH,
  (p: string) => p.length >= 12,
  (p: string) => /[a-z]/.test(p),
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /[0-9]/.test(p),
  (p: string) => /[^a-zA-Z0-9]/.test(p),
];

export function getPasswordStrength(password: string): PasswordStrength {
  const met = RULES.filter((rule) => rule(password)).length;

  if (met <= 2) return { level: 1, label: "Débil", color: "var(--color-error)" };
  if (met <= 4) return { level: 2, label: "Media", color: "var(--color-warning)" };
  return { level: 3, label: "Fuerte", color: "var(--color-success)" };
}
