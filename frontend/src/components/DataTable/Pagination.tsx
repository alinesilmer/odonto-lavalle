import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./DataTable.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => (
  <div className={styles.pagination}>
    <button
      type="button"
      className={styles.pagerButton}
      onClick={() => onChange(Math.max(1, page - 1))}
      disabled={page === 1}
      aria-label="Anterior"
    >
      <ChevronLeft size={18} aria-hidden="true" />
    </button>

    <span className={styles.pageInfo}>
      {page} / {totalPages}
    </span>

    <button
      type="button"
      className={styles.pagerButton}
      onClick={() => onChange(Math.min(totalPages, page + 1))}
      disabled={page === totalPages}
      aria-label="Siguiente"
    >
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  </div>
);

export default Pagination;
