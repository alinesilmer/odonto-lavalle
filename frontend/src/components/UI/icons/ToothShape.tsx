import type { SVGProps } from "react";

/** Symmetric tooth outline on a 40×48 box, crown at the top, roots at the bottom. */
export const TOOTH_PATH =
  "M10 2C4.5 2 2 6.5 2 11.5c0 4 1.4 6.8 2.4 10 .9 3 1.2 7 1.9 12.5.6 4.6 1.7 11 5 11 2.8 0 3.3-5 4-9 .5-3 1.6-5 4.7-5s4.2 2 4.7 5c.7 4 1.2 9 4 9 3.3 0 4.4-6.4 5-11 .7-5.5 1-9.5 1.9-12.5 1-3.2 2.4-6 2.4-10C38 6.5 35.5 2 30 2c-4 0-6 2-10 2S14 2 10 2z";

/** The tooth silhouette shared by the brushing game and the odontogram. */
export function ToothShape(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 48" aria-hidden="true" focusable="false" {...props}>
      <path d={TOOTH_PATH} />
    </svg>
  );
}
