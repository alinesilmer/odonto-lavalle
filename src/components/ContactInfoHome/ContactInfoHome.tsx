"use client";

import { motion } from "framer-motion";
import Accordion from "../../components/UI/Accordion/Accordion";
import { faqs } from "../../data/faqs";
import Button from "../UI/Button/Button";
import { Link } from "react-router-dom";
import styles from "./ContactInfoHome.module.scss";



const ContactInfoHome = () => {
    return (
        <>
     <section className={styles.consultSection}>
        <div className={styles.consultContainer}>
          <motion.div
            className={styles.consultLeft}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://res.cloudinary.com/dcfkgepmp/image/upload/v1768581122/WhatsApp_Image_2026-01-16_at_1.16.16_PM_hlukdy.jpg"
              alt="Consulta dental"
              className={styles.consultImage}
            />
            <div className={styles.consultContent}>
              <h2 className={styles.consultTitle}>AGENDÁ TU CONSULTA</h2>
              <p className={styles.consultText}>
                Para cuidarte bien, primero te vemos. En la consulta revisamos tu boca, despejamos dudas y,
                si hace falta, pedimos estudios. Así definimos el tratamiento ideal para vos. Por eso se
                agenda consulta; los tratamientos perfectos para vos se planifican luego.
              </p>
              <Link to="/turno">
                <Button variant="primary">RESERVAR</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className={styles.consultRight}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className={styles.faqTitle}>PREGUNTAS FRECUENTES</h2>
            <div className={styles.faqList}>
              {faqs.map((faq) => (
                <Accordion key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
            <img src="https://res.cloudinary.com/dcfkgepmp/image/upload/v1768581282/WhatsApp_Image_2026-01-16_at_1.25.06_PM_ecq43f.jpg" alt="Herramientas dentales" className={styles.faqImage} />
          </motion.div>
        </div>
      </section>
      </>
     )
}

export default ContactInfoHome;