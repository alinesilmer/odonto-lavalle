import { useCallback, useRef, useState, type ReactNode } from "react";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { ConfirmContext, type ConfirmOptions } from "./confirmContext";

interface Pending extends ConfirmOptions {
  resolve: (accepted: boolean) => void;
}

/** Renders the one confirmation dialog the whole app asks through (see useConfirm). */
const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState<Pending | null>(null);
  // Remembers the last question so the dialog keeps its text while it animates out.
  const last = useRef<Pending | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        const next = { ...options, resolve };
        last.current = next;
        setPending(next);
      }),
    [],
  );

  const answer = useCallback(
    (accepted: boolean) => {
      pending?.resolve(accepted);
      setPending(null);
    },
    [pending],
  );

  const close = useCallback(() => answer(false), [answer]);
  const shown = pending ?? last.current;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={Boolean(pending)}
        onClose={close}
        size="sm"
        title={shown?.title}
        footer={
          <>
            <Button variant="secondary" size="small" onClick={close}>
              {shown?.cancelLabel ?? "Cancelar"}
            </Button>
            <Button variant={shown?.tone === "danger" ? "danger" : "primary"} size="small" onClick={() => answer(true)}>
              {shown?.confirmLabel ?? "Confirmar"}
            </Button>
          </>
        }
      >
        {shown?.message ? <p>{shown.message}</p> : null}
      </Modal>
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
