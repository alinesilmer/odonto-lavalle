import { Search } from "lucide-react";
import Input from "../Input/Input";
import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder, also used as the accessible name. */
  label: string;
  className?: string;
}

/** The list-filter search box used by the dashboards. */
const SearchInput = ({ value, onChange, label, className }: SearchInputProps) => (
  <div className={`${styles.search} ${className ?? ""}`}>
    <Input
      name="search"
      type="search"
      aria-label={label}
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leftIcon={<Search size={18} strokeWidth={1.7} />}
    />
  </div>
);

export default SearchInput;
