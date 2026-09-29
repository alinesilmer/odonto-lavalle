import Accordion from "@/components/UI/Accordion/Accordion";
import CheckList from "@/components/UI/CheckList/CheckList";
import NumberedList from "@/components/UI/NumberedList/NumberedList";
import { DEFAULT_SERVICE_DESCRIPTION } from "@/data/serviceDefaults";
import type { ServiceTabKey } from "../tabs";
import type { ResolvedDetails } from "../types";
import styles from "./ServiceTabPanels.module.scss";

interface ServiceTabPanelsProps {
  tab: ServiceTabKey;
  description?: string;
  details: ResolvedDetails;
}

const ServiceTabPanels = ({ tab, description, details }: ServiceTabPanelsProps) => {
  switch (tab) {
    case "overview":
      return <p className={styles.lead}>{description || DEFAULT_SERVICE_DESCRIPTION}</p>;
    case "benefits":
      return <CheckList items={details.benefits} />;
    case "procedure":
      return <NumberedList items={details.steps} />;
    case "care":
      return <CheckList items={details.care} marker="dot" />;
    case "faqs":
      return (
        <div className={styles.faqs}>
          {details.faqs.map((faq) => (
            <Accordion key={faq.q} question={faq.q} answer={faq.a} size="small" />
          ))}
        </div>
      );
  }
};

export default ServiceTabPanels;
