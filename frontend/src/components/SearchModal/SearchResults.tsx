import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import HighlightedText from "./HighlightedText";
import SearchIcon from "./SearchIcon";
import type { SearchItem } from "./types";
import styles from "./SearchResults.module.scss";

interface SearchResultsProps {
  results: SearchItem[];
  query: string;
  selected: number;
  onHover: (index: number) => void;
  onPick: (item: SearchItem) => void;
}

const SearchResults = ({ results, query, selected, onHover, onPick }: SearchResultsProps) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
    <ul className={styles.results} role="listbox">
      {results.length === 0 ? (
        <motion.li
          className={styles.noResults}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search size={24} strokeWidth={1.5} aria-hidden="true" />
          <p>No encontramos resultados para "{query}"</p>
          <span>Intentá con otros términos de búsqueda</span>
        </motion.li>
      ) : null}

      {results.map((item, index) => (
        <motion.li
          key={item.url + item.title}
          className={`${styles.result} ${index === selected ? styles.active : ""}`}
          onMouseEnter={() => onHover(index)}
          onClick={() => onPick(item)}
          role="option"
          aria-selected={index === selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <div className={styles.resultIcon}>
            <SearchIcon name={item.icon} />
          </div>

          <div className={styles.resultContent}>
            <div className={styles.resultHeader}>
              <h4 className={styles.title}>
                <HighlightedText text={item.title} query={query} />
              </h4>
              <span className={styles.badge}>{item.category}</span>
            </div>

            {item.description ? (
              <p className={styles.desc}>
                <HighlightedText text={item.description} query={query} />
              </p>
            ) : null}
          </div>

          <ArrowRight size={18} className={styles.chev} aria-hidden="true" />
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default SearchResults;
