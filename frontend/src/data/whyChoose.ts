import { CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import whyUs from "@/assets/images/whyUs.jpg";
import whyUs2 from "@/assets/images/whyUs2.jpg";
import whyUs3 from "@/assets/images/whyUs3.jpg";
import whyUs4 from "@/assets/images/whyUs4.jpg";

export interface ClinicReason {
  image: string;
  title: string;
  summary: string;
  details: string[];
  icon: LucideIcon;
}

export const CLINIC_REASONS: ClinicReason[] = [
  {
    image: whyUs,
    title: "Atención humana y cercana",
    summary:
      "Acompañamiento personalizado en cada instancia del tratamiento para que te sientas cómodo y seguro.",
    details: ["Consultas sin apuro", "Seguimiento post-tratamiento", "Atención personalizada"],
    icon: HeartHandshake,
  },
  {
    image: whyUs2,
    title: "Calidad en cada tratamiento",
    summary:
      "Trabajo minucioso, materiales de primera línea y protocolos cuidadosos en cada paso.",
    details: ["Protocolos de bioseguridad", "Trabajo minucioso", "Controles periódicos"],
    icon: ShieldCheck,
  },
  {
    image: whyUs3,
    title: "Diagnóstico integral",
    summary: "Plan de tratamiento basado en evidencia, priorizando salud, función y estética.",
    details: ["Evaluación completa", "Plan personalizado", "Enfoque preventivo"],
    icon: CheckCircle2,
  },
  {
    image: whyUs4,
    title: "Resultados estéticos",
    summary: "Acabados naturales y armoniosos para una sonrisa saludable y confiable.",
    details: ["Diseño de sonrisa", "Materiales premium", "Resultados duraderos"],
    icon: Sparkles,
  },
];
