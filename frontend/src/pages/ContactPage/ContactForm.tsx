import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/UI/Input/Input";
import Textarea from "@/components/UI/Textarea/Textarea";
import { Send } from "lucide-react";
import Alert from "@/components/UI/Alert/Alert";
import Button from "@/components/UI/Button/Button";
import { contactFormSchema, type ContactFormData } from "@/schemas";
import { publicApi } from "@/services";
import { clinicWhatsappUrl } from "@/utils/clinicContact";
import { openInNewTab } from "@/utils/whatsapp";
import { buildWhatsappMessage } from "./whatsappMessage";
import { inView, reveal } from "@/utils/editorialMotion";
import styles from "./ContactPage.module.scss";

interface ContactFormProps {
  onSent: () => void;
}

const ContactForm = ({ onSent }: ContactFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues: { name: "", reason: "", email: "", phone: "", message: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);

    // Save the enquiry first so it is not lost if the WhatsApp handoff fails.
    try {
      await publicApi.contact({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `[${data.reason}] ${data.message}`,
      });
    } catch {
      setSubmitError("No pudimos guardar tu consulta, pero podés enviarla por WhatsApp.");
    }

    openInNewTab(clinicWhatsappUrl(buildWhatsappMessage(data)));
    onSent();
  });

  return (
    <motion.div
      className={styles.formCard}
      variants={reveal}
      custom={1}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
    >
      <h2 className={styles.formTitle}>
        Envianos tu <em>consulta.</em>
      </h2>
      <p className={styles.formLead}>Te respondemos por WhatsApp a la brevedad.</p>

      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <div className={styles.row}>
          <Input
            label="Nombre completo"
            placeholder="Juan Pérez"
            required
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Motivo"
            placeholder="Consulta brackets"
            required
            disabled={isSubmitting}
            error={errors.reason?.message}
            {...register("reason")}
          />
        </div>

        <div className={styles.row}>
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tucorreo@gmail.com"
            required
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            type="tel"
            label="Teléfono"
            placeholder="3794532535"
            required
            disabled={isSubmitting}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>

        <Textarea
          label="Mensaje"
          placeholder="Escribí acá tu mensaje..."
          rows={5}
          required
          disabled={isSubmitting}
          error={errors.message?.message}
          {...register("message")}
        />

        {submitError ? (
          <Alert>{submitError}</Alert>
        ) : null}

        <Button
          type="submit"
          loading={isSubmitting}
          icon={<Send size={17} strokeWidth={1.7} aria-hidden="true" />}
          className={styles.submit}
        >
          {isSubmitting ? "Enviando..." : "Enviar consulta"}
        </Button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
