import type { StatsSeriesPoint } from "@odonto/shared";
import Panel from "@/components/UI/Panel/Panel";
import styles from "./MonthChart.module.scss";

interface MonthChartProps {
  /** One point per month of the current year, January first (the API's shape). */
  points: readonly StatsSeriesPoint[];
  /** How many months up to the current one to show. */
  months?: number;
  eyebrow?: string;
  title?: string;
  /** Taller plot for the statistics page. */
  tall?: boolean;
}

/**
 * One series, so no legend: the title names it. Bars are a single hue with the
 * current month emphasised; values appear on hover (and always for the current
 * month), and a visually hidden table carries the same numbers.
 */
const MonthChart = ({ points, months = 6, eyebrow, title = "Turnos por mes", tall = false }: MonthChartProps) => {
  const currentMonth = new Date().getMonth();
  const visible = points.slice(0, currentMonth + 1).slice(-months);
  const max = Math.max(1, ...visible.map((point) => point.value));
  const total = visible.reduce((sum, point) => sum + point.value, 0);

  return (
    <Panel eyebrow={eyebrow ?? `Últimos ${visible.length} meses · ${total} turnos`} title={title}>
      <div className={`${styles.plot} ${tall ? styles.tall : ""}`} aria-hidden="true">
        {visible.map((point, i) => {
          const current = i === visible.length - 1;
          return (
            <div key={point.label} className={styles.column}>
              <span className={`${styles.value} ${current ? styles.valueShown : ""}`}>{point.value}</span>
              <div className={styles.track}>
                <div
                  className={`${styles.bar} ${current ? styles.current : ""}`}
                  style={{ height: `${(point.value / max) * 100}%` }}
                />
              </div>
              <span className={styles.label}>{point.label}</span>
            </div>
          );
        })}
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {visible.map((point) => (
            <tr key={point.label}>
              <th scope="row">{point.label}</th>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
};

export default MonthChart;
