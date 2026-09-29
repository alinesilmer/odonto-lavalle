import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import tooth from "@/assets/images/tooth.webp";
import type { ActivityItem, QuickAction } from "@/data/dashboardHome";
import styles from "./DashboardHome.module.scss";

interface DashboardHomeProps {
  greeting: string;
  subtitle: string;
  actions: QuickAction[];
  activityTitle: string;
  activity: ActivityItem[];
}

/** The welcome panel and activity feed both dashboards open on. */
const DashboardHome = ({
  greeting,
  subtitle,
  actions,
  activityTitle,
  activity,
}: DashboardHomeProps) => (
  <section className={styles.welcomeSection}>
    <motion.div
      className={styles.welcomeCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.welcomeContent}>
        <h1>{greeting}</h1>
        <p>{subtitle}</p>

        <div className={styles.quickActions}>
          {actions.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.mascot}>
        <img src={tooth} alt="" />
      </div>
    </motion.div>

    <motion.div
      className={styles.notifications}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h3>{activityTitle}</h3>

      <div className={styles.notificationList}>
        {activity.map((item) => (
          <div key={item.title} className={styles.notification}>
            <div className={styles.notifIcon}>{item.icon}</div>
            <div>
              <p className={styles.notifTitle}>{item.title}</p>
              <p className={styles.notifDate}>{item.when}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default DashboardHome;
