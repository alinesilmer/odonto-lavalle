import { useCallback, useState } from "react";

const STORAGE_KEY = "lavalle.dentalGame.best";

/** Storage can be blocked (private mode, disabled cookies); the game still works without it. */
function readBest(): number {
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

/** The visitor's best score, remembered in this browser. */
export function useBestScore() {
  const [best, setBest] = useState(readBest);

  const record = useCallback((score: number) => {
    setBest((current) => {
      if (score <= current) return current;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(score));
      } catch {
        // Not persisted; still shown for this visit.
      }
      return score;
    });
  }, []);

  return { best, record };
}
