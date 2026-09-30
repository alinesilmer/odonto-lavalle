import { useMemo } from "react";
import { NO_INSURANCE, insuranceLabel } from "@odonto/shared";
import type { SelectOption } from "@/components/UI/Select/Select";
import { useContent } from "./useContent";

/**
 * The obras sociales a patient can pick: the ones the clinic lists in
 * Contenido del sitio → Obras sociales (the same list the public site shows),
 * plus "Particular (sin obra social)". An old value that's no longer listed
 * (e.g. a legacy code) is kept so editing a patient never silently changes it.
 */
export function useInsuranceOptions(current?: string): SelectOption[] {
  const insurances = useContent("insurances");

  return useMemo(() => {
    const options: SelectOption[] = insurances.map((i) => ({ value: i.name, label: i.name }));
    options.push({ value: NO_INSURANCE, label: insuranceLabel(NO_INSURANCE) });
    if (current && !options.some((o) => o.value === current)) {
      options.push({ value: current, label: insuranceLabel(current) });
    }
    return options;
  }, [insurances, current]);
}
