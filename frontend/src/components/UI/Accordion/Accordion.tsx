import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { EASE_OUT } from "@/utils/editorialMotion";
import styles from "./Accordion.module.scss";

interface AccordionProps {
  question: string;
  answer: string;
  /** Controlled mode: pass both to keep one item open at a time across a list. */
  open?: boolean;
  onToggle?: () => void;
  size?: "medium" | "small";
}

/** A question that expands to show its answer. Works alone or controlled by a list. */
const Accordion = ({ question, answer, open, onToggle, size = "medium" }: AccordionProps) => {
  const [ownOpen, setOwnOpen] = useState(false);
  const isOpen = open ?? ownOpen;
  const toggle = onToggle ?? (() => setOwnOpen((value) => !value));
  const panelId = useId();

  return (
    <div className={`${styles.item} ${styles[size]} ${isOpen ? styles.open : ""}`}>
      <button type="button" className={styles.question} aria-expanded={isOpen} aria-controls={panelId} onClick={toggle}>
        {question}
        <Plus className={styles.icon} size={size === "small" ? 18 : 22} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={panelId}
            className={styles.answerWrap}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <p className={styles.answer}>{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
