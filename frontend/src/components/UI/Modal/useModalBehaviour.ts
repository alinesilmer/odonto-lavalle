import { useEffect, useRef } from "react";

/**
 * The behaviour every dialog needs and none of them used to have: Escape
 * closes it, the page behind stops scrolling, and focus moves into the dialog
 * so keyboard users are not left back at the top of the document.
 */
export function useModalBehaviour(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    // Leave focus alone when the dialog already put it somewhere inside (e.g. a search box).
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return dialogRef;
}
