import { motion } from "framer-motion";
import { wordRise } from "@/utils/editorialMotion";
import styles from "./RisingWords.module.scss";

interface RisingWordsProps {
  words: readonly string[];
  /** Words (from the end) set in the italic accent. */
  accentCount?: number;
  /** Index the stagger starts from, to chain after other words. */
  startIndex?: number;
}

/**
 * Each word rises out of its own mask, one after another. The parent motion
 * element decides when (on load or when scrolled into view).
 */
const RisingWords = ({ words, accentCount = 0, startIndex = 0 }: RisingWordsProps) => {
  const split = words.length - accentCount;

  const render = (word: string, i: number) => (
    <span key={`${word}-${i}`} className={styles.mask} aria-hidden="true">
      <motion.span className={styles.word} variants={wordRise} custom={startIndex + i + (i >= split ? 0.5 : 0)}>
        {word}
      </motion.span>
    </span>
  );

  return (
    <>
      <span className="sr-only">{words.join(" ")}</span>
      {words.slice(0, split).map((word, i) => render(word, i))}
      {accentCount > 0 ? <em>{words.slice(split).map((word, i) => render(word, split + i))}</em> : null}
    </>
  );
};

export default RisingWords;
