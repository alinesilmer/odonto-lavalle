import { useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import FeatureCard from "@/components/UI/FeatureCard/FeatureCard";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import TopicModal from "./TopicModal";
import type { SupportTopic } from "./types";
import styles from "./Support.module.scss";

interface SupportShellProps {
  lead: string;
  topics: SupportTopic[];
  /** Whatever the role adds below the guides: the ticket inbox or the contact form. */
  children: ReactNode;
}

/** Intro, guide cards and the step-by-step dialog, shared by both roles. */
const SupportShell = ({ lead, topics, children }: SupportShellProps) => {
  const [active, setActive] = useState<SupportTopic | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <p>{lead}</p>
        <Button
          variant="ink"
          size="small"
          href={clinicWhatsappUrl("Hola, necesito ayuda con la plataforma.")}
          icon={<MessageCircle size={16} strokeWidth={1.7} aria-hidden="true" />}
        >
          Soporte por WhatsApp
        </Button>
      </div>

      <section aria-label="Guías">
        <div className={styles.cards}>
          {topics.map((topic, index) => (
            <FeatureCard
              key={topic.id}
              index={index}
              icon={topic.icon}
              title={topic.title}
              text={topic.summary}
              openLabel="Ver paso a paso"
              onOpen={() => setActive(topic)}
            />
          ))}
        </div>
      </section>

      {children}

      <TopicModal topic={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default SupportShell;
