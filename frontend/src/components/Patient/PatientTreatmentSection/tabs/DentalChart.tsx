import { ToothShape } from "@/components/UI/icons/ToothShape";
import { TOOTH_GROUP_LABEL, TOOTH_STATUSES_BY_GROUP, TOOTH_STATUS_INFO, toothName } from "../labels";
import type { useToothChart } from "../hooks/useToothChart";
import ToothEditor from "./ToothEditor";
import styles from "./DentalChart.module.scss";

interface DentalChartProps {
  chart: ReturnType<typeof useToothChart>;
  editable: boolean;
}

/** Both arches read facing the patient: upper 18→28, lower 48→38. */
const ARCHES = [
  { label: "Superior", from: 0, to: 16, flip: true },
  { label: "Inferior", from: 16, to: 32, flip: false },
] as const;

/**
 * The odontogram: each tooth drawn as a tooth, coloured by its group and
 * marked with its state's code, the FDI number beneath. Tapping one opens its
 * detail below. The legend spells out every code, so colour is never the only cue.
 */
const DentalChart = ({ chart, editable }: DentalChartProps) => (
  <div className={styles.chart}>
    <ul className={styles.legend} aria-label="Referencias">
      {TOOTH_STATUSES_BY_GROUP.map(({ group, statuses }) => (
        <li key={group} className={styles[group]}>
          <ToothShape className={styles.miniTooth} />
          <span>
            <strong>{TOOTH_GROUP_LABEL[group]}</strong>
            {statuses.some((s) => TOOTH_STATUS_INFO[s].code) ? (
              <span className={styles.codes}>
                {statuses
                  .filter((s) => TOOTH_STATUS_INFO[s].code)
                  .map((s) => `${TOOTH_STATUS_INFO[s].code} ${TOOTH_STATUS_INFO[s].label.toLowerCase()}`)
                  .join(" · ")}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>

    <div className={styles.mouth}>
      {ARCHES.map((arch) => (
        <div key={arch.label} className={styles.arch} role="group" aria-label={`Arcada ${arch.label.toLowerCase()}`}>
          {chart.teeth.slice(arch.from, arch.to).map((tooth, i) => {
            // While editing, the selected tooth previews the state being chosen.
            const info = TOOTH_STATUS_INFO[chart.selected === tooth.number ? chart.draft.status : tooth.status];
            return (
              <button
                key={tooth.number}
                type="button"
                className={`${styles.tooth} ${styles[info.group]} ${chart.selected === tooth.number ? styles.selected : ""} ${
                  i === 7 ? styles.midline : ""
                }`}
                aria-label={`Pieza ${tooth.number}, ${toothName(tooth.number)}: ${TOOTH_STATUS_INFO[tooth.status].label}`}
                aria-pressed={chart.selected === tooth.number}
                onClick={() => chart.select(tooth.number)}
              >
                <span className={styles.shapeWrap}>
                  <ToothShape className={`${styles.shape} ${arch.flip ? styles.flip : ""}`} />
                  {info.code ? (
                    <span className={styles.code} aria-hidden="true">
                      {info.code}
                    </span>
                  ) : null}
                </span>
                <span className={styles.number}>{tooth.number}</span>
                {tooth.notes ? <span className={styles.noteDot} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>

    <ToothEditor chart={chart} editable={editable} />
  </div>
);

export default DentalChart;
