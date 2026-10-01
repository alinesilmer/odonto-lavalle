import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Logo from "@/assets/images/Logo.webp";
import Button from "../Button/Button";
import { ROUTES } from "@/constants";
import SearchModal from "../../SearchModal/SearchModal";
import { useAuth } from "@/auth/useAuth";
import styles from "./Header.module.scss";

const NAV_ITEMS = [
  { path: "/", label: "Inicio" },
  { path: "/nosotros", label: "Nosotros" },
  { path: "/servicios", label: "Servicios" },
  { path: "/contacto", label: "Contacto" },
];

const Header = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/dashboard/admin" : "/dashboard/paciente";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  /** Thin bar under the header that fills as the page scrolls. */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (!typing && e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Lavalle Odontología — inicio">
          <img src={Logo} alt="" className={styles.logoIcon} />
          <span className={styles.logoText}>
            <span className={styles.logoName}>Lavalle</span>
            <em className={styles.logoSubtitle}>odontología</em>
          </span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={`${styles.iconButton} ${styles.searchButton}`}
            aria-label="Buscar"
            onClick={() => setIsSearchOpen(true)}
            type="button"
          >
            <Search size={19} strokeWidth={1.7} />
          </button>

          <Link
            to={user ? dashboardPath : "/login"}
            className={styles.iconButton}
            aria-label={user ? "Ir a mi panel" : "Ingresar"}
            title={user ? user.fullName : "Ingresar"}
          >
            <User size={19} strokeWidth={1.7} />
          </Link>

          <Button to={ROUTES.booking} variant="ink" size="small" arrow className={styles.cta}>
            Reservar turno
          </Button>

          <button
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            {isMenuOpen ? <X size={24} strokeWidth={1.7} /> : <Menu size={24} strokeWidth={1.7} />}
          </button>
        </div>
      </div>

      <motion.div className={styles.progress} style={{ scaleX: progress }} aria-hidden="true" />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.mobileNavLink} ${isActive(item.path) ? styles.active : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              to={ROUTES.booking}
              variant="ink"
              arrow
              fullWidth
              className={styles.mobileCta}
              onClick={() => setIsMenuOpen(false)}
            >
              Reservar turno
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
