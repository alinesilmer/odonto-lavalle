import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/UI/Button/Button";
import { ROUTES } from "@/constants";
import RegisterFormFields from "./RegisterForm";
import RegisterHero from "./RegisterHero";
import RegisterSuccessModal from "./RegisterSuccessModal";
import { useRegisterForm } from "./useRegisterForm";
import styles from "./Register.module.scss";

const Register = () => {
  const { form, onSubmit, formError, showSuccess, closeSuccess } = useRegisterForm();
  const password = form.watch("password");

  return (
    <div className={styles.registerPage}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <RegisterHero />

        <motion.div
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Crear Cuenta</h2>
            <p className={styles.subtitle}>Completá tus datos para registrarte</p>
          </div>

          <form onSubmit={onSubmit} className={styles.form} noValidate>
            <div className={styles.grid}>
              <RegisterFormFields control={form.control} password={password} />
            </div>

            {formError ? (
              <p className={styles.formError} role="alert">
                {formError}
              </p>
            ) : null}

            <Button variant="primary" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registrando..." : "Crear Cuenta"}
            </Button>

            <p className={styles.loginLink}>
              ¿Ya tenés cuenta? <Link to={ROUTES.login}>Iniciá sesión aquí</Link>
            </p>
          </form>
        </motion.div>
      </motion.div>

      <RegisterSuccessModal open={showSuccess} onClose={closeSuccess} />
    </div>
  );
};

export default Register;
