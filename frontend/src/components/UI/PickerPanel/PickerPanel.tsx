import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { usePopover } from "@/hooks/usePopover";
import styles from "./PickerPanel.module.scss";

interface PickerPanelProps {
  popover: ReturnType<typeof usePopover>;
  label: string;
  children: ReactNode;
  width?: number;
  /** Extra class on the card, e.g. tighter padding for a plain list. */
  className?: string;
}

/** The floating card a picker opens, rendered above everything so dialogs never clip it. */
const PickerPanel = ({ popover, label, children, width = 340, className }: PickerPanelProps) =>
  createPortal(
    <AnimatePresence>
      {popover.open ? (
        <motion.div
          ref={popover.panelRef}
          className={`${styles.panel} ${className ?? ""}`}
          style={{ ...popover.panelStyle, width: `min(${width}px, calc(100vw - 24px))` }}
          role="dialog"
          aria-label={label}
          onKeyDown={popover.onPanelKeyDown}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );

export default PickerPanel;
