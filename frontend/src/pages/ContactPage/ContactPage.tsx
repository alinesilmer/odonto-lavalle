import { useState } from "react";
import EditorialHero from "@/components/UI/EditorialHero/EditorialHero";
import SuccessModal from "@/components/SuccessModal/SuccessModal";
import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";
import ContactMap from "./ContactMap";
import PublicPage from "@/components/UI/PublicPage/PublicPage";
import styles from "./ContactPage.module.scss";

const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <PublicPage>
      <EditorialHero
        eyebrow="Contacto"
        title={
          <>
            Estamos a tu <em>disposición.</em>
          </>
        }
        lead="Escribinos, llamanos o vení a conocernos. Respondemos tus dudas y coordinamos tu visita."
      />

      <section className={styles.contactSection}>
        <ContactDetails />
        <ContactForm onSent={() => setShowSuccess(true)} />
      </section>

      <ContactMap />

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="¡Consulta enviada por WhatsApp!"
        message="Se abrió WhatsApp con tu mensaje. Solo falta presionar Enviar."
       
      />
    </PublicPage>
  );
};

export default ContactPage;
