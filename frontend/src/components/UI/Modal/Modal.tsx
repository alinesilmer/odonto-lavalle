import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE_OUT } from "@/utils/editorialMotion";
import { useModalBehaviour } from "./useModalBehaviour";
import styles from "./Modal.module.scss";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** The heading; wrap an accent phrase in <em>. */
  title?: ReactNode;
  /** Small label above the title. */
  eyebrow?: ReactNode;
  /** Accessible name when the title is not plain text. */
  label?: string;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** A photo (or any media) shown as a column beside the content. */
  media?: ReactNode;
  /** "top" sits the dialog near the top of the screen, like a command palette. */
  align?: "center" | "top";
  /** Drops the built-in header, padding and close button for fully custom content. */
  bare?: boolean;
}

/** The one dialog shell. Every modal in the app renders through it. */
const Modal = ({
  open,
  onClose,
  children,
  title,
  eyebrow,
  label,
  footer,
  size = "md",
  media,
  align = "center",
  bare = false,
}: ModalProps) => {
  const dialogRef = useModalBehaviour(open, onClose);
  const ariaLabel = label ?? (typeof title === "string" ? title : undefined);

  // Portalled to <body>: an ancestor with a filter/transform (e.g. the blurred
  // sticky header) would otherwise become the containing block of the fixed
  // overlay and squash it into that ancestor's box.
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`${styles.overlay} ${align === "top" ? styles.top : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={onClose}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            className={[styles.modal, styles[size], media ? styles.split : ""].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: align === "top" ? -16 : 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: align === "top" ? -12 : 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {media ? <div className={styles.media}>{media}</div> : null}

            {bare ? (
              children
            ) : (
              <div className={styles.panel}>
                {/* Header and body scroll; the footer's buttons stay pinned and visible. */}
                <div className={styles.scroll}>
                  {title || eyebrow ? (
                    <header className={styles.header}>
                      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                      {title ? <h2 className={styles.title}>{title}</h2> : null}
                    </header>
                  ) : null}
                  <div className={styles.body}>{children}</div>
                </div>
                {footer ? <footer className={styles.footer}>{footer}</footer> : null}
              </div>
            )}

            {bare ? null : (
              <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
                <X size={20} strokeWidth={1.7} aria-hidden="true" />
              </button>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
