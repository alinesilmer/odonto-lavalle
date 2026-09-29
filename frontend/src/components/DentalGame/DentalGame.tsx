import { motion } from "framer-motion";
import { inView, reveal } from "@/utils/editorialMotion";
import NumberedList from "../UI/NumberedList/NumberedList";
import SectionHeading from "../UI/SectionHeading/SectionHeading";
import GameBoard from "./GameBoard";
import GameHud from "./GameHud";
import GameOverScreen from "./GameOverScreen";
import GameStartScreen from "./GameStartScreen";
import { GAME } from "./gameLogic";
import { useDentalGame } from "./useDentalGame";
import styles from "./DentalGame.module.scss";

const STEPS = [
  "Mantené presionado el mouse, o tu dedo en el celular, y pasá el cepillo.",
  "Terminá cada diente: si lo dejás a medias, la placa vuelve.",
  `Limpiá dientes seguidos para multiplicar puntos, hasta ×${GAME.maxCombo}.`,
  `Atrapá la estrella: suma ${GAME.bonusSeconds} segundos extra.`,
];

const DentalGame = () => {
  const game = useDentalGame();

  const overlay = game.over ? (
    <GameOverScreen
      score={game.score}
      previousBest={game.bestBefore}
      cleanliness={game.cleanliness}
      onRestart={game.start}
    />
  ) : !game.started ? (
    <GameStartScreen onStart={game.start} />
  ) : null;

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.intro}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <SectionHeading
          size="sm"
          index="04"
          eyebrow="Jugá"
          title={
            <>
              Un minuto para dejar tu sonrisa <em>brillando.</em>
            </>
          }
        />

        <NumberedList items={STEPS} />

        <p className={styles.tip}>
          <strong>Consejo:</strong> cepillate los dientes al menos 3 veces por día, durante 2
          minutos.
        </p>
      </motion.div>

      <motion.div
        className={styles.card}
        variants={reveal}
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <GameHud
          score={game.score}
          best={game.best}
          timeLeft={game.timeLeft}
          combo={game.combo}
        />
        <GameBoard
          boardRef={game.boardRef}
          teeth={game.teeth}
          cleanliness={game.cleanliness}
          running={game.running}
          brushing={game.brushing}
          pointer={game.pointer}
          bonus={game.bonus}
          pops={game.pops}
          clock={game.clock}
          onPointerDown={(x, y) => {
            game.setBrushing(true);
            game.moveBrush(x, y, true);
          }}
          onPointerMove={(x, y) => game.moveBrush(x, y, game.brushing)}
          onPointerUp={() => game.setBrushing(false)}
          onPointerLeave={() => {
            game.setBrushing(false);
            game.setPointer(null);
          }}
          onClaimBonus={game.claimBonus}
          overlay={overlay}
        />
      </motion.div>
    </section>
  );
};

export default DentalGame;
