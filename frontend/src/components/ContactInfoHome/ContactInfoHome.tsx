import { useState } from "react";
import { motion } from "framer-motion";
import { useContent } from "@/hooks/useContent";
import { inView, reveal } from "@/utils/editorialMotion";
import Accordion from "@/components/UI/Accordion/Accordion";
import PaymentMethods from "@/components/InsurancePayment/PaymentMethods";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import styles from "./ContactInfoHome.module.scss";

/** Home FAQ: one answer open at a time, plus the accepted payment methods. */
const ContactInfoHome = () => {
  const faqs = useContent("faqs");
  // The first answer starts open; "" until the user picks one.
  const [chosenId, setOpenId] = useState<string | null>("");
  const openId = chosenId === "" ? (faqs[0]?.id ?? null) : chosenId;

  return (
    <section className={styles.section}>
      <SectionHeading
        className={styles.heading}
        size="sm"
        plainAccent
        index="03"
        eyebrow="Preguntas frecuentes"
        title={
          <>
            Antes de tu <em>primera visita.</em>
          </>
        }
      />

      <motion.div
        className={styles.list}
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        {faqs.map((faq) => (
          <Accordion
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            open={openId === faq.id}
            onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
          />
        ))}

        <div className={styles.payments}>
          <PaymentMethods id="metodos-de-pago" />
        </div>
      </motion.div>
    </section>
  );
};

export default ContactInfoHome;
