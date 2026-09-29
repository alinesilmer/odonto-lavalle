import { useCallback, useState } from "react";
import { ApiRequestError } from "@/services/http";

/**
 * Runs a create/update/delete request: tracks `saving`, surfaces the server's
 * message (or a fallback) as `actionError`, and reloads the list on success.
 */
export function useWriteAction(reload: () => void) {
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const runWrite = useCallback(
    async (write: () => Promise<unknown>, fallback: string) => {
      setSaving(true);
      setActionError(null);
      try {
        await write();
        reload();
        return true;
      } catch (err) {
        setActionError(err instanceof ApiRequestError ? err.message : fallback);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [reload],
  );

  return { saving, actionError, setActionError, runWrite };
}
