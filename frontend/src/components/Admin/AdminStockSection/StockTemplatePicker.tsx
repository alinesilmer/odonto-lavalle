import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Hand,
  LayoutGrid,
  Layers,
  PenLine,
  ScanLine,
  Scissors,
  ShieldCheck,
  Smile,
  Sparkles,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { STOCK_TEMPLATES, STOCK_TEMPLATE_CATEGORIES, type StockTemplate, type StockTemplateCategory } from "@/data/stockTemplates";
import { normalizeText } from "@/utils/text";
import StockTemplateCard from "./StockTemplateCard";
import styles from "./StockTemplatePicker.module.scss";

const ALL = "Todas";
type Filter = typeof ALL | StockTemplateCategory;

const CATEGORY_ICON: Record<StockTemplateCategory, LucideIcon> = {
  Descartables: Hand,
  Anestesia: Syringe,
  Restauración: Sparkles,
  Endodoncia: Activity,
  Radiología: ScanLine,
  "Esterilización e higiene": ShieldCheck,
  "Profilaxis y prevención": Smile,
  Cirugía: Scissors,
  Impresión: Layers,
};

const FILTERS: { id: Filter; icon: LucideIcon; count: number }[] = [
  { id: ALL, icon: LayoutGrid, count: STOCK_TEMPLATES.length },
  ...STOCK_TEMPLATE_CATEGORIES.map((id) => ({
    id,
    icon: CATEGORY_ICON[id],
    count: STOCK_TEMPLATES.filter((t) => t.category === id).length,
  })),
];

interface StockTemplatePickerProps {
  onPick: (template: StockTemplate) => void;
  /** "Producto personalizado": skip the templates and fill the form by hand. */
  onManual: () => void;
}

/** The template catalog: categories on the side, searchable cards grouped by category; picking one fills the form. */
const StockTemplatePicker = ({ onPick, onManual }: StockTemplatePickerProps) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(ALL);
  const needle = normalizeText(query);

  // A search looks through every category; otherwise the chosen one.
  const groups = useMemo(() => {
    const found = STOCK_TEMPLATES.filter((t) =>
      needle ? normalizeText(`${t.product} ${t.category}`).includes(needle) : filter === ALL || t.category === filter,
    );
    return STOCK_TEMPLATE_CATEGORIES.map((category) => ({ category, items: found.filter((t) => t.category === category) })).filter(
      (g) => g.items.length > 0,
    );
  }, [needle, filter]);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className={styles.picker}>
      <div className={styles.top}>
        <SearchInput label="Buscar en las plantillas: guantes, resina, anestesia…" value={query} onChange={setQuery} />
        <button type="button" className={styles.manual} onClick={onManual}>
          <PenLine size={18} strokeWidth={1.6} aria-hidden="true" />
          <span>
            <strong>Producto personalizado</strong>
            <small>Completar a mano</small>
          </span>
        </button>
      </div>

      <div className={styles.body}>
        <nav className={styles.categories} aria-label="Categorías de plantillas">
          {FILTERS.map(({ id, icon: Icon, count }) => {
            const active = !needle && filter === id;
            return (
              <button
                key={id}
                type="button"
                className={`${styles.category} ${active ? styles.categoryActive : ""}`}
                aria-pressed={active}
                onClick={() => {
                  setFilter(id);
                  setQuery("");
                }}
              >
                <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
                <span className={styles.categoryName}>{id}</span>
                <span className={styles.categoryCount}>{count}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.results} aria-live="polite">
          <p className={styles.summary}>
            {needle ? `${total} resultado${total === 1 ? "" : "s"} para "${query.trim()}"` : `${total} plantillas`}
          </p>

          {groups.length === 0 ? (
            <div className={styles.empty}>
              <p>No hay plantillas con ese nombre.</p>
              <button type="button" className={styles.emptyAction} onClick={onManual}>
                Cargarlo como producto personalizado <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          ) : (
            groups.map(({ category, items }) => {
              const Icon = CATEGORY_ICON[category];
              return (
                <section key={category} className={styles.group} aria-label={category}>
                  {groups.length > 1 || needle ? <h3 className={styles.groupTitle}>{category}</h3> : null}
                  <ul className={styles.cards}>
                    {items.map((template) => (
                      <li key={template.product}>
                        <StockTemplateCard template={template} icon={Icon} onPick={onPick} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StockTemplatePicker;
