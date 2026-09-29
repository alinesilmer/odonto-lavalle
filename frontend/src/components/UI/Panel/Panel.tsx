import type { ReactNode } from "react";
import { useId } from "react";
import styles from "./Panel.module.scss";

interface PanelProps {
  eyebrow?: string;
  title: string;
  /** Right side of the header, e.g. a "Ver todos" link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A white dashboard box with a small label, a serif title and its content. */
const Panel = ({ eyebrow, title, action, children, className }: PanelProps) => {
  const titleId = useId();

  return (
    <section className={`${styles.panel} ${className ?? ""}`} aria-labelledby={titleId}>
      <header className={styles.head}>
        <div>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h3 id={titleId} className={styles.title}>
            {title}
          </h3>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
};

export default Panel;
