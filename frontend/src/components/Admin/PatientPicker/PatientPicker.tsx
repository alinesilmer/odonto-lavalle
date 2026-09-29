import { useId, useState, type KeyboardEvent } from "react";
import { Search, UserRound } from "lucide-react";
import { INSURANCE_LABEL, type PatientDto } from "@odonto/shared";
import Input from "@/components/UI/Input/Input";
import PickerPanel from "@/components/UI/PickerPanel/PickerPanel";
import { useApi } from "@/hooks/useApi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { usePopover } from "@/hooks/usePopover";
import { patientsApi } from "@/services";
import styles from "./PatientPicker.module.scss";

interface PatientPickerProps {
  name: string;
  label?: string;
  /** What's typed in the box (a name or DNI). */
  query: string;
  onQueryChange: (query: string) => void;
  /** Called with the chosen patient, or null when the text no longer matches one. */
  onSelect: (patient: PatientDto | null) => void;
  selectedId?: string;
  error?: string;
}

const EMPTY: PatientDto[] = [];

/** Search-as-you-type over the registered patients, from the first letter; picking one fills the box. */
const PatientPicker = ({ name, label = "Paciente", query, onQueryChange, onSelect, selectedId, error }: PatientPickerProps) => {
  const popover = usePopover<HTMLInputElement>();
  const listId = useId();
  const [active, setActive] = useState(0);
  const term = useDebouncedValue(query.trim(), 200);
  const { data, loading } = useApi(
    () => (term ? patientsApi.list({ search: term, pageSize: 8 }) : Promise.resolve({ items: EMPTY })),
    [term],
  );
  const results = term ? (data?.items ?? EMPTY) : EMPTY;

  const choose = (patient: PatientDto) => {
    onQueryChange(patient.fullName);
    onSelect(patient);
    popover.close();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!popover.open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (results.length ? (i + step + results.length) % results.length : 0));
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      choose(results[active]);
    } else {
      popover.onPanelKeyDown(event);
    }
  };

  return (
    <>
      <Input
        ref={popover.anchorRef}
        name={name}
        label={label}
        placeholder="Escribí nombre o DNI"
        autoComplete="off"
        role="combobox"
        aria-expanded={popover.open}
        aria-controls={listId}
        aria-autocomplete="list"
        leftIcon={<Search size={18} aria-hidden="true" />}
        value={query}
        error={error}
        hint={selectedId ? "Paciente seleccionado" : undefined}
        onChange={(e) => {
          onQueryChange(e.target.value);
          onSelect(null);
          setActive(0);
          if (e.target.value.trim()) popover.show();
          else popover.close();
        }}
        onFocus={() => query.trim() && !selectedId && popover.show()}
        onKeyDown={onKeyDown}
      />
      <PickerPanel popover={popover} label="Pacientes encontrados" width={460}>
        <div className={styles.panel}>
          {results.length === 0 ? (
            <p className={styles.empty}>
              {loading || term !== query.trim() ? "Buscando…" : `No hay pacientes que coincidan con "${query.trim()}".`}
            </p>
          ) : (
            <ul id={listId} role="listbox" className={styles.list}>
              {results.map((patient, i) => (
                <li
                  key={patient.id}
                  role="option"
                  aria-selected={i === active}
                  className={`${styles.option} ${i === active ? styles.active : ""}`}
                  onPointerDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(patient)}
                >
                  <UserRound size={18} strokeWidth={1.6} aria-hidden="true" />
                  <span className={styles.name}>{patient.fullName}</span>
                  <span className={styles.meta}>
                    DNI {patient.dni}
                    {patient.insurance ? ` · ${INSURANCE_LABEL[patient.insurance] ?? patient.insurance}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PickerPanel>
    </>
  );
};

export default PatientPicker;
