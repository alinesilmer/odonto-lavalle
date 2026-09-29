import { useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import IconButton from "@/components/UI/IconButton/IconButton";
import Textarea from "@/components/UI/Textarea/Textarea";
import { ToothShape } from "@/components/UI/icons/ToothShape";
import { EASE_OUT } from "@/utils/editorialMotion";
import { TOOTH_GROUP_LABEL, TOOTH_STATUSES_BY_GROUP, TOOTH_STATUS_INFO, TOOTH_STATUS_LABEL, toothName } from "../labels";
import type { useToothChart } from "../hooks/useToothChart";
import styles from "./ToothEditor.module.scss";

interface ToothEditorProps {
  chart: ReturnType<typeof useToothChart>;
  /** Patients read the selected tooth; only the clinic can change it. */
  editable: boolean;
}

/** The selected tooth's name, state and description, editable in place. */
const ToothEditor = ({ chart, editable }: ToothEditorProps) => {
  const groupId = useId();
  const tooth = chart.current;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {tooth ? (
        <motion.section
          key={tooth.number}
          className={styles.editor}
          aria-label={`Pieza ${tooth.number}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
        >
          <header className={styles.editorHead}>
            <div className={styles.editorTitle}>
              <ToothShape className={`${styles.editorTooth} ${styles[TOOTH_STATUS_INFO[chart.draft.status].group]}`} />
              <div>
                <p className={styles.editorEyebrow}>Pieza {tooth.number}</p>
                <h4>{toothName(tooth.number)}</h4>
              </div>
            </div>
            <IconButton label="Cerrar detalle" onClick={chart.close}>
              <X aria-hidden="true" />
            </IconButton>
          </header>

          {editable ? (
            <>
              <fieldset className={styles.statusPicker}>
                <legend id={groupId}>Estado</legend>
                <div role="radiogroup" aria-labelledby={groupId} className={styles.groups}>
                  {TOOTH_STATUSES_BY_GROUP.map(({ group, statuses }) => (
                    <div key={group} className={styles.group}>
                      <span className={styles.groupLabel}>{TOOTH_GROUP_LABEL[group]}</span>
                      <div className={styles.options}>
                        {statuses.map((status) => {
                          const info = TOOTH_STATUS_INFO[status];
                          const chosen = chart.draft.status === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              role="radio"
                              aria-checked={chosen}
                              className={`${styles.statusOption} ${styles[group]} ${chosen ? styles.statusChosen : ""}`}
                              onClick={() => chart.setStatus(status)}
                            >
                              <ToothShape className={styles.miniTooth} />
                              {info.label}
                              {info.code ? <span className={styles.optionCode}>{info.code}</span> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <Textarea
                name={`tooth-${tooth.number}-notes`}
                label="Descripción"
                rows={3}
                placeholder="Ej: empaste de resina en la cara oclusal"
                value={chart.draft.notes}
                onChange={(e) => chart.setNotes(e.target.value)}
              />

              <div className={styles.editorActions}>
                {chart.justSaved ? (
                  <span className={styles.saved} role="status">
                    <Check size={16} strokeWidth={2} aria-hidden="true" /> Cambios guardados
                  </span>
                ) : null}
                <Button variant="link" size="small" onClick={chart.discard} disabled={!chart.dirty}>
                  Descartar
                </Button>
                <Button size="small" onClick={() => void chart.save()} disabled={!chart.dirty}>
                  Guardar cambios
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.readOnly}>
              <p>
                <strong>{TOOTH_STATUS_LABEL[tooth.status]}</strong>
              </p>
              <p>{tooth.notes || "Sin observaciones."}</p>
            </div>
          )}
        </motion.section>
      ) : (
        <motion.p key="hint" className={styles.hint} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {editable ? "Tocá una pieza para ver su estado y editarlo." : "Tocá una pieza para ver su estado."}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default ToothEditor;
