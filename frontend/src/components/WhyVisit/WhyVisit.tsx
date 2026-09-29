import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { services } from "../../data/services";
import { ToothIcon } from "../UI/icons/ToothIcon";
import MoreInfoModal from "../MoreInfoModal/MoreInfoModal";
import FeatureCard from "@/components/UI/FeatureCard/FeatureCard";
import SectionHeading from "@/components/UI/SectionHeading/SectionHeading";
import styles from "./WhyVisit.module.scss";

type Service = (typeof services)[number];

const WhyVisit = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  /** The large tooth outline drifts slower than the page as it scrolls by. */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const driftY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <motion.div className={styles.decor} style={{ y: driftY }} aria-hidden="true">
        <ToothIcon size={560} fill="none" stroke="currentColor" strokeWidth={0.3} />
      </motion.div>

      <div className={styles.inner}>
        <SectionHeading
          size="md"
          index="02"
          eyebrow="Cuándo visitarnos"
          lead="Te contamos tres razones por las cuales una visita cada seis meses puede ser tu mejor opción."
          title={
            <>
              La mejor visita es la que llega <em>antes del dolor.</em>
            </>
          }
        />

        <div className={styles.cards}>
          {services.map((service, index) => (
            <FeatureCard
              key={service.id}
              index={index}
              title={service.title}
              text={service.description}
              onOpen={() => setSelectedService(service)}
            />
          ))}
        </div>
      </div>

      <MoreInfoModal
        open={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </section>
  );
};

export default WhyVisit;
