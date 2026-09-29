import { ArrowLeftRight, Banknote, CreditCard } from "lucide-react";
import Chip from "@/components/UI/Chip/Chip";
import { paymentMethods } from "@/data/insurance";
import styles from "./PaymentMethods.module.scss";

const ICONS = { card: CreditCard, cash: Banknote, transfer: ArrowLeftRight };

/** The accepted payment methods as labelled chips; used on the home FAQ and the coverage modal. */
const PaymentMethods = ({ id }: { id?: string }) => (
  <div id={id} className={styles.payments}>
    <span className={styles.label}>Medios de pago</span>
    <ul className={styles.list}>
      {paymentMethods.map((method) => {
        const Icon = ICONS[method.icon];
        return (
          <li key={method.id}>
            <Chip size="small" icon={<Icon size={16} strokeWidth={1.6} aria-hidden="true" />}>
              {method.name}
            </Chip>
          </li>
        );
      })}
    </ul>
  </div>
);

export default PaymentMethods;
