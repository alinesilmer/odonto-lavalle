import { useId } from "react";
import { LayoutGroup, motion } from "framer-motion";
import styles from "./Tabs.module.scss";

export interface TabItem<K extends string> {
  id: K;
  label: string;
  /** Optional count shown after the label, e.g. how many items match. */
  count?: number;
}

interface TabsProps<K extends string> {
  items: readonly TabItem<K>[];
  active: K;
  onChange: (id: K) => void;
  /** "pill" slides a dark pill; "underline" slides an accent line. */
  variant?: "pill" | "underline";
  label: string;
  className?: string;
}

/** A row of options where the highlight glides to the chosen one. */
function Tabs<K extends string>({
  items,
  active,
  onChange,
  variant = "pill",
  label,
  className,
}: TabsProps<K>) {
  // Unique per instance, so two tab rows on one page never share an animation.
  const layoutId = useId();

  return (
    <div className={`${styles.tabs} ${styles[variant]} ${className ?? ""}`} role="toolbar" aria-label={label}>
      <LayoutGroup id={layoutId}>
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.tab} ${selected ? styles.selected : ""}`}
              aria-pressed={selected}
              onClick={() => onChange(item.id)}
            >
              {selected ? (
                <motion.span
                  layoutId="indicator"
                  className={styles.indicator}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              ) : null}
              <span className={styles.text}>{item.label}</span>
              {item.count !== undefined ? <span className={styles.count}>{item.count}</span> : null}
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

export default Tabs;
