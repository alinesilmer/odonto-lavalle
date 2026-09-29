import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./Button.module.scss";

type Variant =
  /** Filled brand blue — the main action. */
  | "primary"
  /** Outlined on a light surface. */
  | "secondary"
  /** Filled near-black. */
  | "ink"
  /** Filled light, for dark surfaces. */
  | "light"
  /** Outlined, for dark surfaces. */
  | "outlineDark"
  /** Text with an underline, no box. */
  | "link"
  /** Filled red — for irreversible actions such as deleting. */
  | "danger";

/** "outline" was the old name for the outlined style; kept so existing screens keep working. */
type LegacyVariant = "outline";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "onClick"> {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  variant?: Variant | LegacyVariant;
  size?: "small" | "medium" | "large";
  /** Internal route: renders a router <Link>. */
  to?: string;
  /** External address: renders an <a>; http(s) links open in a new tab. */
  href?: string;
  /** Icon before the label. */
  icon?: ReactNode;
  /** Adds the arrow that nudges right on hover. */
  arrow?: boolean;
  fullWidth?: boolean;
  /** Shows a spinner and blocks clicks while a request is in flight. */
  loading?: boolean;
  className?: string;
}

/**
 * The one button of the site. Every call to action — a form submit, a route
 * link, a WhatsApp link — renders through this, so they all look and behave alike.
 */
const Button = ({
  children,
  variant = "primary",
  size = "medium",
  to,
  href,
  icon,
  arrow = false,
  fullWidth = false,
  loading = false,
  className,
  type = "button",
  onClick,
  ...buttonProps
}: ButtonProps) => {
  const resolved = variant === "outline" ? "secondary" : variant;
  const classes = [
    styles.button,
    styles[resolved],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className ?? "",
  ].join(" ");

  const content = (
    <>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      <span>{children}</span>
      {arrow ? <ArrowRight className={styles.arrow} size={18} strokeWidth={1.8} aria-hidden="true" /> : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={buttonProps["aria-label"]}>
        {content}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={buttonProps["aria-label"]}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
};

export default Button;
