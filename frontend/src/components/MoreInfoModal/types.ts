export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceDetails {
  benefits?: string[];
  steps?: string[];
  care?: string[];
  faqs?: ServiceFaq[];
}

export interface ServiceSummary {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  details?: ServiceDetails;
}

/** Details with every section filled, after the defaults are applied. */
export type ResolvedDetails = Required<ServiceDetails>;
