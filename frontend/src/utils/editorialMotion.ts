import type { Variants } from "framer-motion";

/**
 * Motion vocabulary of the public pages. Every section uses these so the
 * whole site moves the same way: a soft rise, a blur that comes into focus,
 * and a hairline that draws itself.
 */

export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

/** Play once, when a quarter of the element is on screen. */
export const inView = { once: true, amount: 0.25 } as const;

/** Rises into place. Pass `custom={index}` to stagger siblings. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay: index * 0.1 },
  }),
};

/** Comes into focus — used for section headings. */
export const blurIn: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_OUT },
  },
};

/** A line that draws from the left. Inherits its parent's trigger. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.1, ease: EASE_OUT, delay: 0.3 } },
};

/** Hero headline words, each rising out of its own mask. */
export const wordRise: Variants = {
  hidden: { y: "110%" },
  visible: (index: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE_OUT, delay: 0.05 + index * 0.07 },
  }),
};

/** Fades up once on page load; `custom` is the delay in seconds. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  }),
};

/** Spread on a motion element to rise in on page load (not on scroll), staggered by `index`. */
export const riseOnLoad = (index: number) =>
  ({ variants: reveal, custom: index, initial: "hidden", animate: "visible" }) as const;
