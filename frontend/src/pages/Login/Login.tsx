import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Alert from "@/components/UI/Alert/Alert";
import Button from "@/components/UI/Button/Button";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input/Input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas";
import { useAuth } from "@/auth/useAuth";
import { ApiRequestError } from "@/services/http";
import LoginAside from "./LoginAside";
import styles from "./Login.module.scss";

const ADMIN_DASHBOARD_ROUTE = "/dashboard/admin";
const PATIENT_DASHBOARD_ROUTE = "/dashboard/paciente";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting, isSubmitted },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormError(null);
    try {
      const user = await login(data);

      // Send the user back where they were headed before the login redirect.
      const from = (location.state as { from?: string } | null)?.from;
      const fallback = user.role === "admin" ? ADMIN_DASHBOARD_ROUTE : PATIENT_DASHBOARD_ROUTE;
      navigate(from ?? fallback, { replace: true });
    } catch (err) {
      if (err instanceof ApiRequestError && err.details) {
        for (const [field, message] of Object.entries(err.details)) {
          if (field === "email" || field === "password") {
            setError(field, { type: "server", message });
          }
        }
      }
      setFormError(
        err instanceof ApiRequestError ? err.message : "No pudimos conectar con el servidor",
      );
    }
  };

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginAside />

        <motion.div
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.formHeader}>
            <p className={styles.eyebrow}>Mi panel</p>
            <h1 className={styles.title}>
              Bienvenido <em>de nuevo.</em>
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    leftIcon={<Mail size={18} strokeWidth={1.7} />}
                    error={fieldState.error?.message}
                    touched={fieldState.isTouched || isSubmitted}
                    required
                    {...field}
                  />
                )}
              />
            </div>

            <div className={styles.field}>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <div className={styles.passwordField}>
                    <Input
                      label="Contraseña"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      leftIcon={<Lock size={18} strokeWidth={1.7} />}
                      error={fieldState.error?.message}
                      touched={fieldState.isTouched || isSubmitted}
                      required
                      {...field}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.7} /> : <Eye size={18} strokeWidth={1.7} />}
                    </button>
                  </div>
                )}
              />
            </div>
            {formError && (
              <Alert>{formError}</Alert>
            )}

            <Button type="submit" fullWidth arrow={!isSubmitting} loading={isSubmitting} className={styles.submit}>
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>

            {/*
              Patient sign-up is planned for later; for now only the clinic's
              admins log in. Restore this link (and the Link import) when it ships.
            <p className={styles.registerLink}>
              ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
            </p>
            */}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
