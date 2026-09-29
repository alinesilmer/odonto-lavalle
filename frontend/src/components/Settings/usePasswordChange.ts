import { useCallback, useState } from "react";
import { authApi } from "@/services";
import { ApiRequestError } from "@/services/http";

export interface PasswordFields {
  current: string;
  next: string;
  confirm: string;
}

const EMPTY: PasswordFields = { current: "", next: "", confirm: "" };

/** The optional "change my password" block both settings screens carry. */
export function usePasswordChange() {
  const [fields, setFields] = useState<PasswordFields>(EMPTY);

  const filled = Boolean(fields.current || fields.next || fields.confirm);

  /** Returns an error message, or null when there was nothing to do / it worked. */
  const submit = useCallback(async (): Promise<string | null> => {
    if (!filled) return null;
    if (fields.next !== fields.confirm) return "Las contraseñas nuevas no coinciden";

    try {
      await authApi.changePassword({
        currentPassword: fields.current,
        newPassword: fields.next,
      });
      setFields(EMPTY);
      return null;
    } catch (err) {
      return err instanceof ApiRequestError ? err.message : "No pudimos cambiar la contraseña";
    }
  }, [fields, filled]);

  return {
    fields,
    filled,
    set: useCallback(
      (patch: Partial<PasswordFields>) => setFields((current) => ({ ...current, ...patch })),
      [],
    ),
    submit,
  };
}
