/**
 * Select options derived from the shared value sets, so a form can never offer
 * a value the API would reject.
 */
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_LABEL,
  GENDERS,
  GENDER_LABEL,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABEL,
} from "@odonto/shared";

export interface SelectOption {
  value: string;
  label: string;
}

const optionsFrom = <T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
): SelectOption[] => values.map((value) => ({ value, label: labels[value] }));

export const GENDER_OPTIONS = optionsFrom(GENDERS, GENDER_LABEL);
// Obras sociales come from the clinic's own list: see hooks/useInsuranceOptions.
export const APPOINTMENT_STATUS_OPTIONS = optionsFrom(
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_LABEL,
);
export const PAYMENT_STATUS_OPTIONS = optionsFrom(PAYMENT_STATUSES, PAYMENT_STATUS_LABEL);
