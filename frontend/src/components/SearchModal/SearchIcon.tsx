import { Calendar, Info, Phone, Stethoscope } from "lucide-react";
import { ToothIcon } from "@/components/UI/icons";
import type { SearchIconName } from "./types";

const ICONS = {
  tooth: ToothIcon,
  stethoscope: Stethoscope,
  calendar: Calendar,
  phone: Phone,
  info: Info,
};

/** `info` is the fallback for an entry that names no icon. */
const SearchIcon = ({ name = "info" }: { name?: SearchIconName }) => {
  const Icon = ICONS[name];
  return <Icon size={18} aria-hidden="true" />;
};

export default SearchIcon;
