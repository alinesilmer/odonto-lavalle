import type { ReactNode } from "react";
import styles from "./AsyncBoundary.module.scss";

interface Props {
  loading: boolean;
  error: string | null;
  /** Renders the empty state instead of children when true. */
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
}

/** The loading / error / empty shell every API-backed dashboard section shares. */
export default function AsyncBoundary({
  loading,
  error,
  empty,
  emptyMessage = "No hay datos para mostrar",
  onRetry,
  children,
}: Props) {
  if (loading) {
    return (
      <div className={styles.state} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.state} ${styles.error}`} role="alert">
        <p>{error}</p>
        {onRetry && (
          <button type="button" className={styles.retry} onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={styles.state}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
