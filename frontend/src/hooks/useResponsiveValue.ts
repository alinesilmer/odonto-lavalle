import { useEffect, useState } from "react";

export interface Breakpoint<T> {
  /** Max viewport width in px this entry applies to. */
  upTo: number;
  value: T;
}

/**
 * Picks a value from the first matching breakpoint, falling back to
 * `defaultValue` on wider screens. Re-evaluates as the viewport changes.
 */
export function useResponsiveValue<T>(breakpoints: Breakpoint<T>[], defaultValue: T): T {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const queries = breakpoints.map((bp) => ({
      query: window.matchMedia(`(max-width: ${bp.upTo}px)`),
      value: bp.value,
    }));

    const update = () => {
      setValue(queries.find(({ query }) => query.matches)?.value ?? defaultValue);
    };

    update();
    queries.forEach(({ query }) => query.addEventListener("change", update));
    return () => queries.forEach(({ query }) => query.removeEventListener("change", update));
    // The breakpoint list is a module constant at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return value;
}
