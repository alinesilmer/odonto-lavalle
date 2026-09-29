import { motion } from "framer-motion";
import Chip from "@/components/UI/Chip/Chip";
import { SEARCH_SUGGESTIONS } from "@/data/searchIndex";
import styles from "./SearchEmptyState.module.scss";

interface SearchEmptyStateProps {
  recents: string[];
  onPick: (term: string) => void;
}

const Chips = ({ terms, onPick }: { terms: string[]; onPick: (term: string) => void }) => (
  <div className={styles.chips}>
    {terms.map((term) => (
      <Chip key={term} onClick={() => onPick(term)}>
        {term}
      </Chip>
    ))}
  </div>
);

/** Shown before anything is typed: popular terms plus this browser's history. */
const SearchEmptyState = ({ recents, onPick }: SearchEmptyStateProps) => (
  <motion.div
    className={styles.empty}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 }}
  >
    <h3 className={styles.title}>
      Encontrá lo que <em>necesitás.</em>
    </h3>
    <p className={styles.lead}>Tratamientos, turnos, contacto y toda la información del consultorio.</p>

    <section className={styles.group}>
      <h4 className={styles.groupLabel}>Búsquedas populares</h4>
      <Chips terms={SEARCH_SUGGESTIONS} onPick={onPick} />
    </section>

    {recents.length > 0 ? (
      <section className={styles.group}>
        <h4 className={styles.groupLabel}>Búsquedas recientes</h4>
        <Chips terms={recents} onPick={onPick} />
      </section>
    ) : null}
  </motion.div>
);

export default SearchEmptyState;
