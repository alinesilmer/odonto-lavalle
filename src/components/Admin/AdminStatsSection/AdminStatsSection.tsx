"use client";

import { Bell, CalendarDays, AlarmClock, UserRound, Boxes } from "lucide-react";
import StatsCard from "@/components/StatsCard/StatsCard";
import { adminStats, adminReminders } from "../../../data/dashboardData";
import tooth from "../../../assets/images/tooth.png";
import styles from "./AdminStatsSection.module.scss";

const colorByIcon: Record<string, "primary" | "info" | "success" | "danger"> = {
  users: "primary",
  calendar: "info",
  dollar: "success",
  x: "danger",
};

const AdminStatsSection = () => {
  return (
    <section id="stats" className={styles.section}>
      <div className={styles.topRow}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeLeft}>
           <div className={styles.welcomeBox}>
      <div className={styles.welcomeLeft}>
        <div className={styles.titleGroup}>
          <h3 className={styles.hello}>¡HOLA, USUARIO!</h3>
          <p className={styles.subtitle}>¿Qué vamos a hacer hoy?</p>
        </div>
       
      </div>
      <div className={styles.mascot}>
        <img
          src={tooth} alt="Mascota"
        />
      </div>
    </div>
          </div>

          <aside className={styles.notifications}>
            <div className={styles.notifHeader}>
              <Bell size={18} />
              <span>NOTIFICACIONES</span>
            </div>
            <div className={styles.notifList}>
              {adminReminders.map((n) => (
                <div key={n.id} className={styles.notifItem}>
                  <div
                    className={`${styles.badge} ${
                      n.type === "appointment"
                        ? styles.badgeInfo
                        : n.type === "message"
                        ? styles.badgePrimary
                        : styles.badgeWarning
                    }`}
                  />
                  <div className={styles.notifBody}>
                    <p className={styles.notifTitle}>{n.title}</p>
                    <p className={styles.notifDesc}>{n.description}</p>
                  </div>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className={styles.cardsRow}>
        {adminStats.map((s, i) => (
          <StatsCard
            key={`${s.label}-${i}`}
            icon={s.icon as "users" | "calendar" | "dollar" | "x"}
            value={s.value}
            label={s.label}
            color={colorByIcon[s.icon] || "primary"}
          />
        ))}
      </div>
    </section>
  );
};

export default AdminStatsSection;
