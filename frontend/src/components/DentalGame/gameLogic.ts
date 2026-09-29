export const TOOTH_TYPES = ["molar", "incisor", "canine"] as const;
export type ToothType = (typeof TOOTH_TYPES)[number];

export interface GameTooth {
  id: number;
  /** Percentages of the board, so the layout scales with the container. */
  x: number;
  y: number;
  /** Tilt in degrees, so the teeth fan out along the arch. */
  rotate: number;
  jaw: "upper" | "lower";
  /** FDI tooth number, printed under the tooth like on a dental chart. */
  code: number;
  cleanliness: number;
  /** When the brush last touched it (ms); plaque creeps back once it is left alone. */
  brushedAt: number;
  type: ToothType;
}

export const GAME = {
  durationSeconds: 60,
  maxSeconds: 120,
  pointsPerTooth: 10,
  bonusPoints: 20,
  bonusSeconds: 5,
  bonusVisibleMs: 5_000,
  bonusMinDelayMs: 7_000,
  bonusExtraDelayMs: 4_000,
  /** Board-percent radius the brush cleans within. */
  brushRadius: 8,
  brushCoreRadius: 4,
  /** Seconds left at which the clock turns urgent. */
  warningSeconds: 10,
  /** A half-brushed tooth left alone this long starts getting dirty again… */
  decayGraceMs: 1_500,
  /** …losing this much cleanliness per tick. Finished teeth stay clean. */
  decayStep: 2,
  decayTickMs: 400,
  /** Finishing the next tooth within this window raises the multiplier. */
  comboWindowMs: 2_500,
  maxCombo: 5,
} as const;

/** Position along each arch, from the left molar (-1) to the right one (1). */
const ARCH = [-1, -0.6, -0.2, 0.2, 0.6, 1];

/** FDI numbers as seen facing the patient: their right side is on our left. */
const UPPER_CODES = [16, 13, 11, 21, 23, 26];
const LOWER_CODES = [46, 43, 41, 31, 33, 36];

const typeAt = (t: number): ToothType =>
  Math.abs(t) === 1 ? "molar" : Math.abs(t) > 0.5 ? "canine" : "incisor";

/** Six teeth per jaw, laid out on two facing arches like a dental chart. */
export const INITIAL_TEETH: GameTooth[] = [
  ...ARCH.map((t, i) => ({
    id: i + 1,
    x: 50 + t * 36,
    y: 25 + 12 * t * t,
    rotate: 180 + t * 14,
    jaw: "upper" as const,
    code: UPPER_CODES[i],
    cleanliness: 0,
    brushedAt: 0,
    type: typeAt(t),
  })),
  ...ARCH.map((t, i) => ({
    id: i + 7,
    x: 50 + t * 36,
    y: 75 - 12 * t * t,
    rotate: -t * 14,
    jaw: "lower" as const,
    code: LOWER_CODES[i],
    cleanliness: 0,
    brushedAt: 0,
    type: typeAt(t),
  })),
];

/**
 * Cleans every tooth within the brush radius.
 *
 * Returns the new list plus the teeth this stroke finished, so the caller can
 * award points and celebrate them without diffing the arrays itself.
 */
export function brushStroke(
  teeth: GameTooth[],
  x: number,
  y: number,
  now: number,
): { teeth: GameTooth[]; completed: GameTooth[] } {
  const completed: GameTooth[] = [];

  const next = teeth.map((tooth) => {
    const distance = Math.hypot(tooth.x - x, tooth.y - y);
    if (distance >= GAME.brushRadius || tooth.cleanliness === 100) return tooth;

    const gain = distance < GAME.brushCoreRadius ? 3 : 2;
    const cleanliness = Math.min(tooth.cleanliness + gain, 100);
    const updated = { ...tooth, cleanliness, brushedAt: now };
    if (cleanliness === 100) completed.push(updated);

    return updated;
  });

  return { teeth: next, completed };
}

/**
 * Plaque creeps back on teeth that were started but left half done, so the
 * player has to finish each tooth instead of skimming across all of them.
 * Returns the same array when nothing changed, so React can skip the render.
 */
export function decayTeeth(teeth: GameTooth[], now: number): GameTooth[] {
  let changed = false;

  const next = teeth.map((tooth) => {
    const idle = now - tooth.brushedAt > GAME.decayGraceMs;
    if (!idle || tooth.cleanliness === 0 || tooth.cleanliness === 100) return tooth;

    changed = true;
    return { ...tooth, cleanliness: Math.max(0, tooth.cleanliness - GAME.decayStep) };
  });

  return changed ? next : teeth;
}

/** Plaque that is coming back shows as a warning on the tooth. */
export const isDecaying = (tooth: GameTooth, now: number): boolean =>
  tooth.cleanliness > 0 && tooth.cleanliness < 100 && now - tooth.brushedAt > GAME.decayGraceMs;

export const averageCleanliness = (teeth: GameTooth[]): number =>
  teeth.length === 0
    ? 0
    : teeth.reduce((sum, tooth) => sum + tooth.cleanliness, 0) / teeth.length;

/** How visible the plaque layer is: fully brown at 0, gone at 100. */
export const plaqueOpacity = (cleanliness: number): number =>
  Math.max(0, 1 - cleanliness / 100) * 0.95;

export const randomBonusSpot = () => ({
  x: 25 + Math.random() * 50,
  y: 40 + Math.random() * 20,
});

/** The first band the final cleanliness reaches wins; ordered best to worst. */
export const VERDICTS = [
  { min: 100, title: "¡Sonrisa impecable!", text: "Dejaste todos los dientes brillando." },
  { min: 80, title: "¡Muy bien!", text: "Casi todos están listos. Un repaso más y quedan perfectos." },
  { min: 50, title: "Buen trabajo", text: "Falta un poquito más de cepillado en algunos dientes." },
  { min: 0, title: "¡Volvé a intentarlo!", text: "Pasá el cepillo por cada diente, sin apuro." },
] as const;

export const verdictFor = (cleanliness: number) =>
  VERDICTS.find((band) => cleanliness >= band.min) ?? VERDICTS[VERDICTS.length - 1];
