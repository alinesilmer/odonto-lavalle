import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "@/components/UI/Modal/Modal";
import Tabs from "@/components/UI/Tabs/Tabs";
import ZoomImage from "@/components/UI/ZoomImage/ZoomImage";
import { resolveServiceDetails } from "@/data/serviceDefaults";
import ServiceTabPanels from "./tabs/ServiceTabPanels";
import { SERVICE_TABS, type ServiceTabKey } from "./tabs";
import type { ServiceSummary } from "./types";

interface MoreInfoModalProps {
  open: boolean;
  service: ServiceSummary | null;
  onClose: () => void;
}

const MoreInfoModal = ({ open, service, onClose }: MoreInfoModalProps) => {
  const [tab, setTab] = useState<ServiceTabKey>("overview");

  // Each service opens on its own overview rather than the last tab used.
  useEffect(() => {
    if (open) setTab("overview");
  }, [open, service]);

  const details = useMemo(() => resolveServiceDetails(service?.details), [service]);

  return (
    <Modal
      open={open && Boolean(service)}
      onClose={onClose}
      size="xl"
      media={service?.image ? <ZoomImage src={service.image} /> : undefined}
      eyebrow="Cuándo visitarnos"
      title={service?.title}
    >
      <Tabs items={SERVICE_TABS} active={tab} onChange={setTab} variant="underline" label="Secciones del servicio" />
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <ServiceTabPanels tab={tab} description={service?.description} details={details} />
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default MoreInfoModal;
