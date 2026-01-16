"use client";

import type React from "react";
import { useRef, useState } from "react";
import PageHero from "../../components/UI/PageHero/PageHero";
import { Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Input from "../../components/UI/Input/Input";
import Textarea from "../../components/UI/Textarea/Textarea";
import Button from "../../components/UI/Button/Button";
import { useForm } from "../../hooks/useForm";
import { validateEmail, validateRequired } from "../../utils/validation";
import { contactInfo } from "../../data/contactInfo";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import checkAnimation from "../../assets/animations/success.json";
import hero from "./../../assets/images/contactHero.png";
import styles from "./ContactPage.module.scss";

type ContactFormKeys = "name" | "reason" | "email" | "phone" | "message";
type ContactFormData = Record<ContactFormKeys, string>;

function normalizeWhatsappNumber(raw: string): string {
  // WhatsApp wa.me requires digits only, including country code
  // e.g. Argentina mobile often looks like 549 + area + number
  return (raw || "").replace(/\D/g, "");
}

function buildWhatsappMessage(data: ContactFormData): string {
  return [
    "📩 *Nueva consulta desde la web*",
    "",
    `*Nombre:* ${data.name.trim()}`,
    `*Motivo:* ${data.reason.trim()}`,
    `*Email:* ${data.email.trim()}`,
    `*Teléfono:* ${data.phone.trim() ? data.phone.trim() : "(no ingresado)"}`,
    "",
    "*Mensaje:*",
    data.message.trim(),
  ].join("\n");
}

function openInNewTab(url: string) {
  // More reliable than window.open + "noopener,noreferrer" returning null in some browsers
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Guard to prevent double-open on double click / double submit
  const openingRef = useRef(false);

  const validationRules: Partial<Record<ContactFormKeys, ((v: string) => boolean)[]>> = {
    name: [validateRequired],
    reason: [validateRequired],
    email: [validateRequired, validateEmail],
    phone: [],
    message: [validateRequired],
  };

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } =
    useForm<ContactFormData>(
      { name: "", reason: "", email: "", phone: "", message: "" },
      validationRules,
      async () => {
        // Prevent accidental double open
        if (openingRef.current) return;
        openingRef.current = true;

        const WA_NUMBER = normalizeWhatsappNumber(contactInfo.phone || "5493794001708");

        const text = buildWhatsappMessage(values);
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

        // ✅ Open only ONCE, always in a new tab/window (no same-window fallback)
        openInNewTab(url);

        setShowSuccess(true);

        // Release guard after a short delay
        setTimeout(() => {
          openingRef.current = false;
        }, 1200);
      }
    );

  const waNumber = normalizeWhatsappNumber(contactInfo.phone);

  return (
    <div className={styles.contactPage}>
      <PageHero
        title="CONTÁCTANOS"
        subtitle="Estamos a tu disposición para resolver cualquier duda"
        backgroundImage={hero}
      />

      <section className={styles.contactSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.leftPanel}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.title}>VENÍ A CONOCERNOS</h2>
            <p className={styles.description}>
              ¿Tenés alguna consulta que quieras resolver personalmente? Avisanos de tu visita por cualquiera de
              las siguientes plataformas y te recibiremos con gusto.
            </p>

            <div className={styles.contactInfo}>
              <a href={`https://wa.me/${waNumber}`} className={styles.contactItem} target="_blank" rel="noreferrer">
                <div className={styles.iconWrapper}>
                  <Phone size={24} />
                </div>
                <span>{contactInfo.phone}</span>
              </a>

              <a href={`mailto:${contactInfo.email}`} className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <Mail size={24} />
                </div>
                <span>{contactInfo.email}</span>
              </a>

              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <MapPin size={24} />
                </div>
                <span>{contactInfo.address}</span>
              </div>
            </div>

            <div className={styles.notes}>
              <p>NO se reciben visitas sin horario previamente acordado.</p>
              <p>Las consultas con ingreso al consultorio son un servicio y deben ser abonadas.</p>
            </div>
          </motion.div>

          <motion.div
            className={styles.rightPanel}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.title}>ENVIANOS TU CONSULTA</h2>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Nombre Completo *</div>
                  <Input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    placeholder="Juan Pérez"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Motivo *</div>
                  <Input
                    type="text"
                    name="reason"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.reason}
                    touched={touched.reason}
                    placeholder="Consulta brackets"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Correo Electrónico *</div>
                  <Input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    placeholder="tucorreo@gmail.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.fieldLabel}>Teléfono (opcional)</div>
                  <Input
                    type="tel"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.phone}
                    touched={touched.phone}
                    placeholder="3794532535"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Textarea
                  label="Mensaje"
                  name="message"
                  value={values.message}
                  onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
                  onBlur={handleBlur as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
                  error={errors.message}
                  touched={touched.message}
                  placeholder="Escribí acá tu mensaje..."
                  rows={5}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>


      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="¡Consulta enviada por WhatsApp!"
        message="Se abrió WhatsApp con tu mensaje. Solo falta presionar Enviar."
        animationData={checkAnimation}
      />
    </div>
  );
};

export default ContactPage;
