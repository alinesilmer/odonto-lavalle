// "use client"

// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Eye, EyeOff, Instagram } from "lucide-react"
// import { motion } from "framer-motion"
// import Input from "../../components/Input/Input"
// import Button from "../../components/Button/Button"
// import { useForm } from "../../hooks/useForm"
// import { validateEmail, validateRequired } from "../../utils/validation"
// import type { LoginFormData } from "../../types"
// import styles from "./Login.module.scss"

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)

//   const { values, errors, handleChange, handleSubmit } = useForm<LoginFormData>(
//     {
//       email: "",
//       password: "",
//     },
//     {
//       email: [validateRequired, validateEmail],
//       password: [validateRequired],
//     },
//     (data) => {
//       console.log("Login:", data)
//     },
//   )

//   return (
//     <div className={styles.loginPage}>
//       <div className={styles.container}>
//         <motion.div
//           className={styles.leftPanel}
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className={styles.welcome}>¡HOLA!</h1>
//           <p className={styles.description}>
//             Iniciá sesión y disfrutá de todos los beneficios de ser parte de Lavalle Odontología
//           </p>
//           <div className={styles.socialIcons}>
//             <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
//               <Instagram />
//             </a>
//             <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
//               <svg viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
//               </svg>
//             </a>
//           </div>
//         </motion.div>

//         <motion.div
//           className={styles.rightPanel}
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h2 className={styles.title}>INICIAR SESIÓN</h2>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <Input
//               label="Correo Electrónico"
//               type="email"
//               name="email"
//               value={values.email}
//               onChange={handleChange}
//               error={errors.email}
//               placeholder="tucorreo@gmail.com"
//               required
//             />

//             <div className={styles.passwordField}>
//               <Input
//                 label="Contraseña"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={values.password}
//                 onChange={handleChange}
//                 error={errors.password}
//                 placeholder="••••••••"
//                 required
//               />
//               <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             <Button type="submit" variant="primary" fullWidth>
//               INGRESAR
//             </Button>

//             <p className={styles.registerLink}>
//               ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
//             </p>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default Login
