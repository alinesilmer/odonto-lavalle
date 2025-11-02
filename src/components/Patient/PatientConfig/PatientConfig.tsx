"use client"

import { useState } from "react"
import DashboardLayout from "../../DashboardLayout/DashboardLayout"
import Input from "@/components/UI/Input/Input"
import Select from "@/components/UI/Select/Select"
import Button from "@/components/UI/Button/Button"
import styles from "./PatientConfig.module.scss"
import { patientTreatment } from "../../../data/dashboardData"

type FormState = {
  fullName: string
  dni: string
  email: string
  phone: string
  birthDate: string
  gender: string
  insurance: string
  notifEmail: boolean
  notifSms: boolean
  notifWhatsapp: boolean
  darkMode: boolean
  passwordActual: string
  passwordNueva: string
  passwordNueva2: string
}

const PatientConfig = () => {
  const baseName = patientTreatment.patientName ?? "Usuario"
  const [avatarPreview, setAvatarPreview] = useState<string>("https://i.pravatar.cc/150?img=12")
  const [form, setForm] = useState<FormState>({
    fullName: baseName,
    dni: String(patientTreatment.dni ?? ""),
    email: "",
    phone: "",
    birthDate: "",
    gender: String(patientTreatment.gender ?? ""),
    insurance: "",
    notifEmail: true,
    notifSms: false,
    notifWhatsapp: true,
    darkMode: false,
    passwordActual: "",
    passwordNueva: "",
    passwordNueva2: "",
  })

  const onChange = (k: keyof FormState, v: any) => setForm(prev => ({ ...prev, [k]: v }))
  const onAvatar = (file?: File) => { if (file) setAvatarPreview(URL.createObjectURL(file)) }
  const onSubmit = (e: React.FormEvent) => { e.preventDefault() }

  return (
    <DashboardLayout userType="patient" userRole="patient" userName={baseName}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <img src={avatarPreview} alt={baseName} />
              <label className={styles.avatarBtn}>
                <input type="file" accept="image/*" onChange={e => onAvatar(e.target.files?.[0])} />
                Cambiar
              </label>
            </div>
            <div className={styles.headInfo}>
              <h1>Configuración de Usuario</h1>
              <p>Gestioná tus datos personales y preferencias</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.btnSecondary} type="button">Cancelar</button>
            <button className={styles.btnPrimary} type="submit" form="patient-config-form">Guardar cambios</button>
          </div>
        </header>

        <form id="patient-config-form" className={styles.form} onSubmit={onSubmit}>
          <section className={styles.card}>
            <h2>Datos Personales</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Nombre Completo</label>
                <Input  name="Nombre Completo" value={form.fullName} onChange={(e:any)=>onChange("fullName", e.target.value)} placeholder="Nombre y apellido" />
              </div>
              <div className={styles.field}>
                <label>DNI</label>
                <Input  name="DNI" value={form.dni} onChange={(e:any)=>onChange("dni", e.target.value)} placeholder="43747511" />
              </div>
              <div className={styles.field}>
                <label>Fecha de Nacimiento</label>
                <Input name="Fecha de Nacimiento" type="date" value={form.birthDate} onChange={(e:any)=>onChange("birthDate", e.target.value)} />
              </div>
              <div className={styles.field}>
                <Select
                label="Género"
                  name="gender"
                  value={form.gender}
                  onChange={(v:string)=>onChange("gender", v)}
                  options={[
                    { value: "masculino", label: "Masculino" },
                    { value: "femenino", label: "Femenino" },
                    { value: "otro", label: "Otro" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Contacto</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Email</label>
                <Input name="Email" type="email" value={form.email} onChange={(e:any)=>onChange("email", e.target.value)} placeholder="tucorreo@ejemplo.com" />
              </div>
              <div className={styles.field}>
                <label>Teléfono</label>
                <Input name="Teléfono" type="tel" value={form.phone} onChange={(e:any)=>onChange("phone", e.target.value)} placeholder="3794..." />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Obra Social</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <Select
                label="Obra Social"
                  name="insurance"
                  value={form.insurance}
                  onChange={(v:string)=>onChange("insurance", v)}
                  options={[
                    { value: "jersal", label: "Jerárquicos Salud" },
                    { value: "swiss", label: "Swiss Medical" },
                    { value: "medife", label: "Medifé" },
                    { value: "sancor", label: "SanCor Salud" },
                    { value: "ospim", label: "OSPIM" },
                    { value: "galeno", label: "Galeno" },
                    { value: "issunne", label: "ISSUNNE" },
                    { value: "ospjn", label: "OSPJN" },
                    { value: "otro", label: "Otro" },
                    { value: "ninguna", label: "Ninguna" },
                  ]}
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Seguridad</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Nueva contraseña</label>
                <Input name="Nueva contraseña" type="password" value={form.passwordNueva} onChange={(e:any)=>onChange("passwordNueva", e.target.value)} placeholder="••••••••" />
              </div>
              <div className={styles.field}>
                <label>Repetir nueva contraseña</label>
                <Input name="Repetir nueva contraseña" type="password" value={form.passwordNueva2} onChange={(e:any)=>onChange("passwordNueva2", e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Preferencias</h2>
            <div className={styles.grid3}>
              <label className={styles.switch}>
                <input type="checkbox" checked={form.notifEmail} onChange={e=>onChange("notifEmail", e.target.checked)} />
                <span>Email</span>
              </label>
              <label className={styles.switch}>
                <input type="checkbox" checked={form.notifSms} onChange={e=>onChange("notifSms", e.target.checked)} />
                <span>SMS</span>
              </label>
              <label className={styles.switch}>
                <input type="checkbox" checked={form.notifWhatsapp} onChange={e=>onChange("notifWhatsapp", e.target.checked)} />
                <span>WhatsApp</span>
              </label>
             
            </div>
          </section>

          <div className={styles.actionsBottom}>
            <button className={styles.btnSecondary} type="button">Cancelar</button>
            <Button variant="primary" type="submit">Guardar cambios</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default PatientConfig
