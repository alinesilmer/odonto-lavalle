import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EditorialHero from "@/components/UI/EditorialHero/EditorialHero";
import HomeCta from "@/components/HomeCta/HomeCta";
import PhotoCard from "@/components/UI/PhotoCard/PhotoCard";
import Tabs from "@/components/UI/Tabs/Tabs";
import ServiceInfoModal from "@/components/ServiceInfoModal/ServiceInfoModal";
import type { ServiceDto } from "@odonto/shared";
import { SERVICE_FILTERS } from "@/data/serviceCategories";
import { useContent } from "@/hooks/useContent";
import { toSentenceCase } from "@/utils/text";
import PublicPage from "@/components/UI/PublicPage/PublicPage";
import styles from "./Services.module.scss";

const inCategory = (services: ServiceDto[], id: string) =>
  id === "todos" ? services : services.filter((service) => service.category === id);

const Services = () => {
  const services = useContent("services");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(null);

  const filters = SERVICE_FILTERS.map((filter) => ({
    ...filter,
    count: inCategory(services, filter.id).length,
  }));
  const filteredServices = inCategory(services, selectedCategory);

  const openService = (service: ServiceDto) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeService = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <PublicPage>
      <EditorialHero
        eyebrow="Servicios"
        title={
          <>
            Todo lo que tu sonrisa necesita, <em>en un solo lugar.</em>
          </>
        }
        lead="Desde la consulta y la limpieza hasta estética, cirugía y endodoncia. Elegí una categoría y tocá un tratamiento para conocerlo en detalle."
      />

      <section className={styles.catalog}>
        <Tabs
          className={styles.filters}
          items={filters}
          active={selectedCategory}
          onChange={setSelectedCategory}
          label="Filtrar por categoría"
        />

        <motion.ul layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, index) => (
              <PhotoCard
                key={service.id}
                layout
                index={index}
                image={service.image}
                meta={String(index + 1).padStart(2, "0")}
                title={toSentenceCase(service.title)}
                text={service.description}
                onOpen={() => openService(service)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>

      <HomeCta
        title={
          <>
            ¿No sabés qué <em>necesitás?</em>
          </>
        }
        text="Empezá por una consulta: evaluamos tu caso y te recomendamos el tratamiento ideal, con un presupuesto claro."
      />

      <ServiceInfoModal isOpen={isModalOpen} onClose={closeService} service={selectedService} />
    </PublicPage>
  );
};

export default Services;
