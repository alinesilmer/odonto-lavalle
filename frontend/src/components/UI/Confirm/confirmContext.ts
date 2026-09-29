import { createContext, useContext } from "react";

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" paints the confirm button red, for deletions and other irreversible actions. */
  tone?: "default" | "danger";
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/** Lives apart from the provider so that file exports only components (react-refresh). */
export const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Asks the user to confirm with the app's own dialog — never the browser's
 * `confirm()`. Resolves true when they accept, false when they cancel.
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error("useConfirm must be used inside <ConfirmProvider>");
  return confirm;
}
