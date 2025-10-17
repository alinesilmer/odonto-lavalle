"use client";

import { Users, Calendar, DollarSign, X } from "lucide-react";
import styles from "./StatsCard.module.scss";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: "users" | "calendar" | "dollar" | "x";
  color?: "primary" | "info" | "success" | "danger";
}

const StatsCard = ({ label, value, icon, color }: StatsCardProps) => {
  const Icon = (() => {
    switch (icon) {
      case "users":
        return Users;
      case "calendar":
        return Calendar;
      case "dollar":
        return DollarSign;
      case "x":
      default:
        return X;
    }
  })();

  return (
    <div className={styles.statsCard} data-color={color || "primary"}>
      <div className={styles.icon}>
        <Icon size={32} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.label}>{label}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
