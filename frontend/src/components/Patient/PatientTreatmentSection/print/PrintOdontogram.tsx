import type { Tooth } from "@odonto/shared";
import { TOOTH_GROUP_LABEL, TOOTH_STATUS_INFO, TOOTH_STATUSES_BY_GROUP } from "../labels";
import styles from "./TreatmentPrintSheet.module.scss";

/** The odontogram on paper: both arches as numbered boxes with each state's code, plus the legend. */
const PrintOdontogram = ({ teeth }: { teeth: Tooth[] }) => {
  const arches = [teeth.slice(0, 16), teeth.slice(16)];
  return (
    <>
      <div className={styles.chart}>
        {arches.map((arch, i) => (
          <div key={i} className={styles.arch} aria-label={i === 0 ? "Arcada superior" : "Arcada inferior"}>
            {arch.map((tooth) => {
              const info = TOOTH_STATUS_INFO[tooth.status];
              return (
                <div key={tooth.number} className={`${styles.tooth} ${styles[info.group]}`}>
                  <span className={styles.toothNumber}>{tooth.number}</span>
                  <span className={styles.toothBox}>{info.code}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <ul className={styles.legend}>
        {TOOTH_STATUSES_BY_GROUP.filter(({ group }) => group !== "healthy").map(({ group, statuses }) => (
          <li key={group}>
            <span className={`${styles.legendSwatch} ${styles[group]}`} />
            <strong>{TOOTH_GROUP_LABEL[group]}:</strong>{" "}
            {statuses.map((s) => `${TOOTH_STATUS_INFO[s].code} ${TOOTH_STATUS_INFO[s].label.toLowerCase()}`).join(" · ")}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PrintOdontogram;
