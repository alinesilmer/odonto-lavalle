import { Search, X } from "lucide-react";
import Modal from "@/components/UI/Modal/Modal";
import { SEARCH_INDEX } from "@/data/searchIndex";
import SearchEmptyState from "./SearchEmptyState";
import SearchResults from "./SearchResults";
import { useSearchModal } from "./useSearchModal";
import type { SearchItem } from "./types";
import styles from "./SearchModal.module.scss";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  /** Overridable so the palette can be tested without the real index. */
  data?: SearchItem[];
}

const SearchModal = ({ open, onClose, data = SEARCH_INDEX }: SearchModalProps) => {
  const search = useSearchModal(data, open, onClose);

  return (
    <Modal open={open} onClose={onClose} size="lg" align="top" label="Buscar en el sitio" bare>
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search size={22} strokeWidth={1.6} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={search.inputRef}
            value={search.query}
            onChange={(event) => search.setQuery(event.target.value)}
            placeholder="¿Qué estás buscando?"
            aria-label="Buscar"
          />
        </div>

        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          <kbd>Esc</kbd>
          <X size={18} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        {search.query ? (
          <SearchResults
            results={search.results}
            query={search.query}
            selected={search.selected}
            onHover={search.setSelected}
            onPick={search.go}
          />
        ) : (
          <SearchEmptyState recents={search.recents} onPick={search.setQuery} />
        )}
      </div>

      <footer className={styles.footer} aria-hidden="true">
        <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
        <span><kbd>Enter</kbd> abrir</span>
        <span><kbd>/</kbd> buscar desde cualquier página</span>
      </footer>
    </Modal>
  );
};

export default SearchModal;
