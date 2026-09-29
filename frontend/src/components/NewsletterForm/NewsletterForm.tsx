import { useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "@/components/SuccessModal/SuccessModal";
import { STORAGE_KEYS } from "@/constants";
import { useRateLimit } from "@/hooks/useRateLimit";
import { publicMessageSchema, type PublicMessageFormData } from "@/schemas";
import { publicApi } from "@/services";
import { countWords } from "@/utils/text";
import styles from "./NewsletterForm.module.scss";

const MAX_WORDS = 150;
const MESSAGES_PER_HOUR = 3;
const HOUR_MS = 60 * 60 * 1000;

const BLOCKED_MESSAGE = "Demasiados mensajes. Podrás enviar otro en 60 minutos.";

const NewsletterForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { blocked, consume } = useRateLimit(
    STORAGE_KEYS.publicMessageRate,
    MESSAGES_PER_HOUR,
    HOUR_MS,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PublicMessageFormData>({
    resolver: zodResolver(publicMessageSchema),
    mode: "onBlur",
    defaultValues: { message: "" },
  });

  const message = watch("message");
  const words = countWords(message);

  const onSubmit = handleSubmit(async ({ message: body }) => {
    setSendError(null);
    if (!consume()) {
      setSendError(BLOCKED_MESSAGE);
      return;
    }

    try {
      await publicApi.message(body.trim());
    } catch {
      setSendError("No pudimos enviar el mensaje. Intentá de nuevo en unos minutos.");
      return;
    }

    reset();
    setShowSuccess(true);
  });

  const error = errors.message?.message ?? sendError ?? (words > MAX_WORDS ? `Máximo ${MAX_WORDS} palabras` : null);
  const canSend = !isSubmitting && !blocked && words > 0 && words <= MAX_WORDS;

  return (
    <div className={styles.newsletter}>
      <h3 className={styles.title}>¡ESCRIBINOS!</h3>
      <p className={styles.description}>
        ¿Hay un tema que te interese que tratemos el próximo mes? ¡Dejanos tu idea!
      </p>

      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.textarea}
            placeholder={`Escribí tu idea acá (máx. ${MAX_WORDS} palabras)`}
            rows={4}
            maxLength={3000}
            disabled={isSubmitting || blocked}
            aria-invalid={Boolean(error)}
            {...register("message")}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!canSend}
            aria-label="Enviar"
          >
            <Send size={20} />
          </button>
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <div className={styles.helper}>
          {words}/{MAX_WORDS} palabras
        </div>
      </form>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="¡Gracias!"
        message="Tu idea fue enviada. La tendremos en cuenta para el próximo boletín."
       
        autoCloseMs={2600}
      />
    </div>
  );
};

export default NewsletterForm;
