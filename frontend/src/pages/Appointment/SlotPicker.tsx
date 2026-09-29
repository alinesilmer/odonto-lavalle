import { TIME_PREFERENCES, type TimePreference } from "./useBooking";
import styles from "./Booking.module.scss";

interface SlotPickerProps {
  selected: TimePreference | "";
  onSelect: (preference: TimePreference) => void;
}

/** Preferred time of day; the exact time is confirmed by the clinic over WhatsApp. */
const SlotPicker = ({ selected, onSelect }: SlotPickerProps) => (
  <div className={styles.slotsCard}>
    <p className={styles.sectionTitle}>Te confirmamos el horario exacto por WhatsApp</p>

    <div className={styles.slotGrid} role="radiogroup" aria-label="Horario preferido">
      {TIME_PREFERENCES.map((preference) => (
        <button
          key={preference}
          type="button"
          role="radio"
          className={`${styles.slot} ${selected === preference ? styles.slotSelected : ""}`}
          aria-checked={selected === preference}
          onClick={() => onSelect(preference)}
        >
          {preference}
        </button>
      ))}
    </div>
  </div>
);

export default SlotPicker;
