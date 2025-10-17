// "use client"

// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Eye, EyeOff, Instagram } from "lucide-react"
// import { motion } from "framer-motion"
// import Input from "../../components/Input/Input"
// import Select from "../../components/Select/Select"
// import Button from "../../components/Button/Button"
// import { useForm } from "../../hooks/useForm"
// import { validateEmail, validateRequired, validatePhone, validateDNI } from "../../utils/validation"
// import type { RegisterFormData } from "../../types"
// import styles from "./Register.module.scss"

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

//   const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm<RegisterFormData>(
//     {
//       fullName: "",
//       dni: "",
//       gender: "",
//       email: "",
//       phone: "",
//       birthDate: "",
//       password: "",
//       confirmPassword: "",
//       insurance: "",
//     },
//     {
//       fullName: [validateRequired],
//       dni: [validateRequired, validateDNI],
//       gender: [validateRequired],
//       email: [validateRequired, validateEmail],
//       phone: [validateRequired, validatePhone],
//       birthDate: [validateRequired],
//       password: [validateRequired],
//       confirmPassword: [validateRequired],
//       insurance: [validateRequired],
//     },
//     (data) => {
//       console.log("Register:", data)
//     },
//   )

//   const genderOptions = [
//     { value: "masculino", label: "Masculino" },
//     { value: "femenino", label: "Femenino" },
//     { value: "otro", label: "Otro" },
//   ]

//   const insuranceOptions = [
//     { value: "osde", label: "OSDE" },
//     { value: "swiss", label: "Swiss Medical" },
//     { value: "ioscor", label: "IOSCor" },
//     { value: "sancor", label: "SanCor Salud" },
//     { value: "pami", label: "PAMI" },
//     { value: "galeno", label: "Galeno" },
//     { value: "ninguna", label: "Ninguna" },
//   ]

//   return (
//     <div className={styles.registerPage}>
//       <div className={styles.container}>
//         <motion.div
//           className={styles.leftPanel}
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className={styles.welcome}>¡BIENVENIDO!</h1>
//           <p className={styles.description}>
//             Registrate ahora y accedé a una nueva forma de vivir tu experiencia en servicios odontológicos
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
//           <h2 className={styles.title}>CREÁ TU CUENTA</h2>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.row}>
//               <Input
//                 label="Nombre Completo"
//                 type="text"
//                 name="fullName"
//                 value={values.fullName}
//                 onChange={handleChange}
//                 error={errors.fullName}
//                 placeholder="Juan Pérez"
//                 required
//               />
//               <Input
//                 label="DNI (sin puntos)"
//                 type="text"
//                 name="dni"
//                 value={values.dni}
//                 onChange={handleChange}
//                 error={errors.dni}
//                 placeholder="43747511"
//                 required
//               />
//             </div>

//             <div className={styles.row}>
//               <Select
//                 label="Género"
//                 name="gender"
//                 value={values.gender}
//                 onChange={(value) => setFieldValue("gender", value)}
//                 options={genderOptions}
//                 error={errors.gender}
//                 required
//               />
//             </div>

//             <div className={styles.row}>
//               <Input
//                 label="Correo Electrónico"
//                 type="email"
//                 name="email"
//                 value={values.email}
//                 onChange={handleChange}
//                 error={errors.email}
//                 placeholder="tucorreo@gmail.com"
//                 required
//               />
//               <Input
//                 label="Teléfono"
//                 type="tel"
//                 name="phone"
//                 value={values.phone}
//                 onChange={handleChange}
//                 error={errors.phone}
//                 placeholder="3794532535"
//                 required
//               />
//             </div>

//             <div className={styles.row}>
//               <Input
//                 label="Fecha de nacimiento"
//                 type="date"
//                 name="birthDate"
//                 value={values.birthDate}
//                 onChange={handleChange}
//                 error={errors.birthDate}
//                 required
//               />
//             </div>

//             <div className={styles.row}>
//               <div className={styles.passwordField}>
//                 <Input
//                   label="Contraseña"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={values.password}
//                   onChange={handleChange}
//                   error={errors.password}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button type="button" className={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               <div className={styles.passwordField}>
//                 <Input
//                   label="Confirmar Contraseña"
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   error={errors.confirmPassword}
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className={styles.eyeButton}
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 >
//                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className={styles.row}>
//               <Select
//                 label="Obra Social"
//                 name="insurance"
//                 value={values.insurance}
//                 onChange={(value) => setFieldValue("insurance", value)}
//                 options={insuranceOptions}
//                 error={errors.insurance}
//                 required
//               />
//             </div>

//             <Button type="submit" variant="primary" fullWidth>
//               REGISTRARME
//             </Button>

//             <p className={styles.loginLink}>
//               ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión aquí</Link>
//             </p>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default Register
