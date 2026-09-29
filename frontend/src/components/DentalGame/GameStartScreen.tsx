import { Play } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import { GAME } from "./gameLogic";
import styles from "./DentalGame.module.scss";

const GameStartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className={styles.screen}>
    <p className={styles.screenKicker}>{GAME.durationSeconds} segundos</p>
    <h3 className={styles.screenTitle}>
      ¿Listo para <em>cepillar?</em>
    </h3>
    <p className={styles.screenText}>Mantené presionado y pasá el cepillo por cada diente.</p>
    <Button onClick={onStart} icon={<Play size={18} strokeWidth={1.8} aria-hidden="true" />}>
      Empezar
    </Button>
  </div>
);

export default GameStartScreen;
