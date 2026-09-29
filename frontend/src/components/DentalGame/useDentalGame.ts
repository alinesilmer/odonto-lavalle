import { useCallback, useEffect, useRef, useState } from "react";
import {
  GAME,
  INITIAL_TEETH,
  averageCleanliness,
  brushStroke,
  decayTeeth,
  randomBonusSpot,
  type GameTooth,
} from "./gameLogic";
import { useBestScore } from "./useBestScore";

interface Bonus {
  x: number;
  y: number;
  visible: boolean;
}

/** A short-lived "+10" floating over the spot that earned it. */
export interface ScorePop {
  id: number;
  x: number;
  y: number;
  label: string;
}

const POP_LIFETIME_MS = 900;

export function useDentalGame() {
  const boardRef = useRef<HTMLDivElement>(null);
  const popId = useRef(0);

  const [teeth, setTeeth] = useState<GameTooth[]>(INITIAL_TEETH);
  /** Latest teeth, so several pointer moves between renders build on each other. */
  const teethRef = useRef<GameTooth[]>(INITIAL_TEETH);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME.durationSeconds);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [brushing, setBrushing] = useState(false);
  /** Where the brush is drawn, in board pixels; null when the pointer is outside. */
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [bonus, setBonus] = useState<Bonus>({ x: 50, y: 50, visible: false });
  const [pops, setPops] = useState<ScorePop[]>([]);
  const { best, record } = useBestScore();
  /** Best score when the current round began, to tell a real new record from a tie. */
  const [bestBefore, setBestBefore] = useState(best);
  /** Current multiplier; kept in a ref too so rapid strokes read the latest value. */
  const [combo, setCombo] = useState(0);
  const comboRef = useRef(0);
  const comboTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** Ticks with the decay loop, so teeth losing plaque can be flagged on screen. */
  const [clock, setClock] = useState(0);

  const cleanliness = averageCleanliness(teeth);
  const running = started && !over;

  const addPop = useCallback((x: number, y: number, label: string) => {
    const id = ++popId.current;
    setPops((current) => [...current, { id, x, y, label }]);
    setTimeout(() => setPops((current) => current.filter((pop) => pop.id !== id)), POP_LIFETIME_MS);
  }, []);

  const endGame = useCallback(() => {
    setOver(true);
    setStarted(false);
    setBrushing(false);
  }, []);

  const start = useCallback(() => {
    teethRef.current = INITIAL_TEETH;
    setTeeth(INITIAL_TEETH);
    setScore(0);
    setTimeLeft(GAME.durationSeconds);
    setBonus((current) => ({ ...current, visible: false }));
    setPops([]);
    clearTimeout(comboTimer.current);
    comboRef.current = 0;
    setCombo(0);
    setOver(false);
    setStarted(true);
    setBestBefore(best);
  }, [best]);

  // Keep the best score once a round ends.
  useEffect(() => {
    if (over) record(score);
  }, [over, score, record]);

  // Countdown.
  useEffect(() => {
    if (!running) return;
    if (timeLeft === 0) {
      endGame();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, timeLeft, endGame]);

  // Plaque creeps back on half-brushed teeth that are left alone.
  useEffect(() => {
    if (!running) return;

    const tick = setInterval(() => {
      const now = Date.now();
      const next = decayTeeth(teethRef.current, now);
      if (next !== teethRef.current) {
        teethRef.current = next;
        setTeeth(next);
      }
      setClock(now);
    }, GAME.decayTickMs);

    return () => clearInterval(tick);
  }, [running]);

  useEffect(() => () => clearTimeout(comboTimer.current), []);

  // Finishing every tooth ends the round early.
  useEffect(() => {
    if (running && teeth.every((tooth) => tooth.cleanliness === 100)) endGame();
  }, [running, teeth, endGame]);

  // A bonus star appears at random, then times out if it is not claimed.
  useEffect(() => {
    if (!running || bonus.visible) return;

    const delay = GAME.bonusMinDelayMs + Math.random() * GAME.bonusExtraDelayMs;
    const appear = setTimeout(() => setBonus({ ...randomBonusSpot(), visible: true }), delay);

    return () => clearTimeout(appear);
  }, [running, bonus.visible]);

  useEffect(() => {
    if (!bonus.visible) return;

    const hide = setTimeout(
      () => setBonus((current) => ({ ...current, visible: false })),
      GAME.bonusVisibleMs,
    );

    return () => clearTimeout(hide);
  }, [bonus.visible]);

  /** Moves the brush; cleans under it only while the pointer is pressed. */
  const moveBrush = useCallback(
    (clientX: number, clientY: number, cleaning: boolean) => {
      const board = boardRef.current;
      if (!board) return;

      const rect = board.getBoundingClientRect();
      setPointer({ x: clientX - rect.left, y: clientY - rect.top });
      if (!cleaning) return;

      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      // Scored outside a state updater: updaters may run twice, which would double the points.
      const { teeth: next, completed } = brushStroke(teethRef.current, x, y, Date.now());
      teethRef.current = next;
      setTeeth(next);

      completed.forEach((tooth) => {
        // Each tooth finished inside the combo window raises the multiplier.
        comboRef.current = Math.min(comboRef.current + 1, GAME.maxCombo);
        const points = GAME.pointsPerTooth * comboRef.current;
        setScore((value) => value + points);
        addPop(tooth.x, tooth.y, comboRef.current > 1 ? `+${points} ×${comboRef.current}` : `+${points}`);
      });

      if (completed.length > 0) {
        setCombo(comboRef.current);
        clearTimeout(comboTimer.current);
        comboTimer.current = setTimeout(() => {
          comboRef.current = 0;
          setCombo(0);
        }, GAME.comboWindowMs);
      }
    },
    [addPop],
  );

  const claimBonus = useCallback(() => {
    addPop(bonus.x, bonus.y, `+${GAME.bonusSeconds}s`);
    setBonus((current) => ({ ...current, visible: false }));
    setTimeLeft((value) => Math.min(value + GAME.bonusSeconds, GAME.maxSeconds));
    setScore((value) => value + GAME.bonusPoints);
  }, [addPop, bonus.x, bonus.y]);

  return {
    boardRef,
    teeth,
    score,
    best,
    bestBefore,
    timeLeft,
    started,
    over,
    running,
    brushing,
    setBrushing,
    pointer,
    setPointer,
    bonus,
    pops,
    combo,
    clock,
    cleanliness,
    start,
    moveBrush,
    claimBonus,
  };
}
