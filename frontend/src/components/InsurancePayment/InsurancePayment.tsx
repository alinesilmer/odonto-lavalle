import { useCallback, useState } from "react";
import Button from "@/components/UI/Button/Button";
import { useContent } from "@/hooks/useContent";
import InsuranceModal from "./InsuranceModal";
import styles from "./InsurancePayment.module.scss";

const InsurancePayment = () => {
  const providers = useContent("insurances");
  /** The list is rendered twice so the marquee can loop without a seam. */
  const loop = [...providers, ...providers];
  const [open, setOpen] = useState(false);
  // Stable, so the modal's keyboard and focus handling is not re-run on every render.
  const close = useCallback(() => setOpen(false), []);

  return (
    <section id="obras-sociales" aria-labelledby="heading-obras-sociales" className={styles.section}>
      <div className={styles.head}>
        <h2 id="heading-obras-sociales" className={styles.label}>
          Trabajamos con
        </h2>
        <Button variant="link" size="small" arrow onClick={() => setOpen(true)}>
          Ver todas las obras sociales
        </Button>
      </div>

      {/* The moving strip opens the full list too; screen readers use the button above. */}
      <button
        type="button"
        className={styles.viewport}
        onClick={() => setOpen(true)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className={styles.track}>
          {loop.map((provider, i) => (
            <span key={`${provider.name}-${i}`} className={styles.item}>
              {provider.name}
              <span className={styles.sep}>✦</span>
            </span>
          ))}
        </span>
      </button>

      <InsuranceModal open={open} onClose={close} providers={providers} />
    </section>
  );
};

export default InsurancePayment;
