import { CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import whyUs from "@/assets/images/whyUs.jpg";
import whyUs2 from "@/assets/images/whyUs2.jpg";
import whyUs3 from "@/assets/images/whyUs3.jpg";
import whyUs4 from "@/assets/images/whyUs4.jpg";

export interface ClinicReason {
  image: string;
  title: string;
  details: string[];
  icon: LucideIcon;
}

export const CLINIC_REASONS: ClinicReason[] = [
  {
    image: whyUs,
    title: "Atención humana y cercana",
    details: ["Consultas sin apuro", "Seguimiento post-tratamiento", "Atención personalizada"],
    icon: HeartHandshake,
  },
  {
    image: whyUs2,
    title: "Calidad en cada tratamiento",
    details: ["Protocolos de bioseguridad", "Trabajo minucioso", "Controles periódicos"],
    icon: ShieldCheck,
  },
  {
    image: whyUs3,
    title: "Diagnóstico integral",
    details: ["Evaluación completa", "Plan personalizado", "Enfoque preventivo"],
    icon: CheckCircle2,
  },
  {
    image: whyUs4,
    title: "Resultados estéticos",
    details: ["Diseño de sonrisa", "Materiales premium", "Resultados duraderos"],
    icon: Sparkles,
  },
];
