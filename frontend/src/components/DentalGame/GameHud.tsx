import { GAME } from "./gameLogic";
import styles from "./DentalGame.module.scss";

interface GameHudProps {
  score: number;
  best: number;
  timeLeft: number;
  combo: number;
}

const GameHud = ({ score, best, timeLeft, combo }: GameHudProps) => {
  const urgent = timeLeft > 0 && timeLeft <= GAME.warningSeconds;

  const stats = [
    { label: "Puntaje", value: score },
    { label: "Tiempo", value: `${timeLeft}s`, highlight: urgent ? styles.urgent : undefined },
    { label: "Combo", value: `×${Math.max(combo, 1)}`, highlight: combo > 1 ? styles.hot : undefined },
    { label: "Récord", value: best },
  ];

  return (
    <dl className={styles.hud}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <dt>{stat.label}</dt>
          {/* Re-keyed on change so the combo pulses again at every step. */}
          <dd key={stat.label === "Combo" ? stat.value : stat.label} className={stat.highlight}>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default GameHud;
