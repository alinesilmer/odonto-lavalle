import type { SVGProps } from "react";

interface ToothIconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

/** Replaces the single `react-icons` glyph the app used, so that dependency can stay out. */
export function ToothIcon({ size = 24, ...props }: ToothIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M7.5 2C5 2 3 4 3 6.8c0 1.5.3 2.7.8 4 .4 1 .6 2 .7 3.2l.4 4.6c.1 1.4.8 2.4 1.8 2.4.9 0 1.5-.7 1.8-2l.8-3.6c.2-.9.7-1.4 1.4-1.4s1.2.5 1.4 1.4l.8 3.6c.3 1.3.9 2 1.8 2 1 0 1.7-1 1.8-2.4l.4-4.6c.1-1.2.3-2.2.7-3.2.5-1.3.8-2.5.8-4C18.4 4 16.4 2 14 2c-1 0-1.8.3-2.6.7-.4.2-.9.2-1.3 0C9.3 2.3 8.5 2 7.5 2Z" />
    </svg>
  );
}
