import type { LucideIcon } from "lucide-react";

export interface SupportTopic {
  id: string;
  title: string;
  summary: string;
  /** Rendered as a numbered list in the topic dialog. */
  details: string[];
  icon: LucideIcon;
}
