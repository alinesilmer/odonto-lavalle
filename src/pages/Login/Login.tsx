"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Instagram, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input/Input";
import Button from "@/components/UI/Button/Button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../schemas/auth";
import styles from "./Login.module.scss";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError, // para manejar errores del backend
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    // TODO: POST a tu backend /auth/login
    await new Promise((r) => setTimeout(r, 800));
    console.log("Login:", data);

    // Ejemplo (cuando backend responde 401/403):
    // setError("email", { type: "manual", message: "Email o contraseña inválidos" });
    // setError("password", { type: "manual", message: "Email o contraseña inválidos" });
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
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
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
