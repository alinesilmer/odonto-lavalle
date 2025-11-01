"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import PageHero from "../../components/PageHero/PageHero";
import ServiceInfoModal from "./../../components/ServiceInfoModal/ServiceInfoModal";
import { detailedServices } from "../../data/detailedServices";
import type { DetailedService } from "../../types";
import hero from "./../../assets/images/servicesBG.png";
import styles from "./Services.module.scss";

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<DetailedService | null>(null);

  const categories = [
    { id: "todos", label: "TODOS", icon: "🦷" },
    { id: "estetica", label: "ESTÉTICA", icon: "🌸" },
    { id: "cirugia", label: "CIRUGÍA", icon: "💉" },
    { id: "tratamiento de conducto", label: "ENDODONCIA", icon: "😁" },
    { id: "otros", label: "OTROS", icon: "💎" },
  ];

  const filteredServices =
    selectedCategory === "todos"
      ? detailedServices
      : detailedServices.filter(
          (service) => service.category === selectedCategory
        );

  const handleServiceClick = (service: DetailedService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <div className={styles.servicesPage}>
      <PageHero
        title="NUESTROS SERVICIOS"
        subtitle="Estamos a tu disposición para resolver cualquier duda"
        backgroundImage={hero}
      />

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>
              Descubrí y filtrá todos nuestros servicios en un click:
            </h3>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>

          <div className={styles.servicesGrid}>
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </div>
      </section>

      <ServiceInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
      />
    </div>
  );
};

const ServiceCard = ({
  service,
  index,
  onClick,
}: {
  service: DetailedService;
  index: number;
  onClick: () => void;
}) => {
  return (
    <motion.div
      className={styles.serviceCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className={styles.imageWrapper}>
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className={styles.image}
        />
        <button className={styles.expandButton}>
          <Maximize2 size={20} />
        </button>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.serviceTitle}>{service.title}</h3>
        <p className={styles.serviceDescription}>{service.description}</p>
      </div>
    </motion.div>
  );
};

export default Services;
