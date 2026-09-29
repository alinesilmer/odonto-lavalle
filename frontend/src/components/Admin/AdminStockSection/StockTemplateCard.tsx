import { ArrowRight, type LucideIcon } from "lucide-react";
import type { StockTemplate } from "@/data/stockTemplates";
import styles from "./StockTemplateCard.module.scss";

interface StockTemplateCardProps {
  template: StockTemplate;
  icon: LucideIcon;
  onPick: (template: StockTemplate) => void;
}

/** One ready-made item in the catalog; clicking it fills the product form. */
const StockTemplateCard = ({ template, icon: Icon, onPick }: StockTemplateCardProps) => (
  <button type="button" className={styles.card} onClick={() => onPick(template)}>
    <span className={styles.cardIcon}>
      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
    </span>
    <span className={styles.cardBody}>
      <span className={styles.cardName}>{template.product}</span>
      <span className={styles.tags}>
        <span>{template.unit}</span>
        <span>mín. {template.minQuantity}</span>
      </span>
    </span>
    <span className={styles.use} aria-hidden="true">
      Usar <ArrowRight size={14} />
    </span>
  </button>
);

export default StockTemplateCard;
