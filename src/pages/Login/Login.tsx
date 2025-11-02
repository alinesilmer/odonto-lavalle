"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Instagram, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import styles from "./Login.module.scss";

const ADMIN_DASHBOARD_ROUTE = "/dashboard/admin";
const PATIENT_DASHBOARD_ROUTE = "/dashboard/paciente";

const HARDCODED_USERS = [
  { email: "admin@lavalle.com", password: "Admin123!", role: "admin", name: "Admin Demo" },
  { email: "paciente@lavalle.com", password: "Paciente123!", role: "patient", name: "Paciente Demo" },
] as const;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    await new Promise((r) => setTimeout(r, 800));

    const found = HARDCODED_USERS.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (!found) {
      setError("email", { type: "manual", message: "Email o contraseña inválidos" });
      setError("password", { type: "manual", message: "Email o contraseña inválidos" });
      return;
    }

    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: "demo-token",
        role: found.role,
        email: found.email,
        name: found.name,
      })
    );

    if (found.role === "admin") {
      navigate(ADMIN_DASHBOARD_ROUTE, { replace: true });
    } else {
      navigate(PATIENT_DASHBOARD_ROUTE, { replace: true });
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
        <motion.div
          className={styles.leftPanel}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
          </div>
          <h1 className={styles.welcome}>¡Bienvenido de nuevo!</h1>
          <p className={styles.description}>
            Iniciá sesión para acceder a tu cuenta y gestionar tus turnos de forma rápida y sencilla
          </p>
          <div className={styles.socialIcons}>
            <a
              href="https://www.instagram.com/lavalle.odontologia/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="Instagram"
            >
              <Instagram />
            </a>
          
          </div>
        </motion.div>

        <motion.div
          className={styles.rightPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.formHeader}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <p className={styles.subtitle}>Ingresá tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
            <div className={styles.field}>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    leftIcon={<Mail size={20} />}
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
                      leftIcon={<Lock size={20} />}
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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                )}
              />
            </div>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.loadingText}>
                  <span className={styles.spinner}></span>
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </Button>

            <p className={styles.registerLink}>
              ¿No tenés cuenta? <Link to="/registro">Registrate aquí</Link>
            </p>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
