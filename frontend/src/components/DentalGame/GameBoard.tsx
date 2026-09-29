import type { PointerEvent, ReactNode, RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { isDecaying, type GameTooth } from "./gameLogic";
import type { ScorePop } from "./useDentalGame";
import Tooth from "./Tooth";
import Toothbrush from "./Toothbrush";
import styles from "./GameBoard.module.scss";

interface GameBoardProps {
  boardRef: RefObject<HTMLDivElement | null>;
  teeth: GameTooth[];
  cleanliness: number;
  running: boolean;
  brushing: boolean;
  pointer: { x: number; y: number } | null;
  bonus: { x: number; y: number; visible: boolean };
  pops: ScorePop[];
  /** Time of the last decay tick, to flag teeth whose plaque is coming back. */
  clock: number;
  onPointerDown: (x: number, y: number) => void;
  onPointerMove: (x: number, y: number) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onClaimBonus: () => void;
  /** Start or result screen, laid over the board. */
  overlay: ReactNode;
}

const GameBoard = ({
  boardRef,
  teeth,
  cleanliness,
  running,
  brushing,
  pointer,
  bonus,
  pops,
  clock,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onClaimBonus,
  overlay,
}: GameBoardProps) => {
  const handleDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!running || (event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onPointerDown(event.clientX, event.clientY);
  };

  return (
    <div className={styles.board}>
      <div
        ref={boardRef}
        className={`${styles.mouth} ${running ? styles.playing : ""}`}
        onPointerDown={handleDown}
        onPointerMove={(e) => running && onPointerMove(e.clientX, e.clientY)}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        <svg className={styles.arches} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M14 37 Q50 13 86 37" />
          <path d="M14 63 Q50 87 86 63" />
        </svg>
        <span className={`${styles.jawLabel} ${styles.jawUpper}`} aria-hidden="true">Superior</span>
        <span className={`${styles.jawLabel} ${styles.jawLower}`} aria-hidden="true">Inferior</span>

        <div className={styles.readout} aria-hidden="true">
          <span className={styles.readoutValue}>{Math.round(cleanliness)}%</span>
          <span className={styles.readoutLabel}>Limpieza</span>
        </div>

        {teeth.map((tooth) => (
          <Tooth key={tooth.id} tooth={tooth} decaying={isDecaying(tooth, clock)} />
        ))}

        {teeth.map((tooth) => (
          <span
            key={tooth.code}
            className={styles.code}
            style={{ left: `${tooth.x}%`, top: `${tooth.y + (tooth.jaw === "upper" ? -13 : 13)}%` }}
            aria-hidden="true"
          >
            {tooth.code}
          </span>
        ))}

        <AnimatePresence>
          {running && bonus.visible && (
            <motion.button
              type="button"
              className={styles.bonus}
              style={{ left: `${bonus.x}%`, top: `${bonus.y}%` }}
              onClick={onClaimBonus}
              aria-label="Bonus: más tiempo y puntos"
              initial={{ scale: 0, x: "-50%", y: "-50%" }}
              animate={{ scale: 1, x: "-50%", y: "-50%" }}
              exit={{ scale: 0, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {pops.map((pop) => (
            <motion.span
              key={pop.id}
              className={styles.pop}
              style={{ left: `${pop.x}%`, top: `${pop.y}%` }}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: [0, 1, 1, 0], y: -48, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              aria-hidden="true"
            >
              {pop.label}
            </motion.span>
          ))}
        </AnimatePresence>

        {running && pointer && <Toothbrush x={pointer.x} y={pointer.y} brushing={brushing} />}

        <AnimatePresence>
          {overlay && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className={styles.overlayCard}
                initial={{ y: 24, scale: 0.97 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {overlay}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Limpieza total"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(cleanliness)}
      >
        <div className={styles.progressFill} style={{ transform: `scaleX(${cleanliness / 100})` }} />
      </div>
    </div>
  );
};

export default GameBoard;
