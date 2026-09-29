import { RotateCcw } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { verdictFor } from "./gameLogic";
import styles from "./DentalGame.module.scss";

interface GameOverScreenProps {
  score: number;
  /** Best score before this round. */
  previousBest: number;
  cleanliness: number;
  onRestart: () => void;
}

const GameOverScreen = ({ score, previousBest, cleanliness, onRestart }: GameOverScreenProps) => {
  const verdict = verdictFor(cleanliness);
  const newRecord = score > previousBest;

  return (
    <div className={styles.screen}>
      <p className={styles.screenKicker}>{newRecord ? "¡Nuevo récord!" : "Fin del juego"}</p>
      <h3 className={styles.screenTitle}>{verdict.title}</h3>
      <p className={styles.screenText}>{verdict.text}</p>

      <dl className={styles.results}>
        <div>
          <dt>Puntaje</dt>
          <dd>{score}</dd>
        </div>
        <div>
          <dt>Limpieza</dt>
          <dd>{Math.round(cleanliness)}%</dd>
        </div>
      </dl>

      <Button onClick={onRestart} icon={<RotateCcw size={18} strokeWidth={1.8} aria-hidden="true" />}>
        Jugar de nuevo
      </Button>
    </div>
  );
};

export default GameOverScreen;
