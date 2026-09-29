import type { SupportTicketStatus } from "../enums";

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface NewsletterRequest {
  email: string;
}

/** Anonymous free-text message from the public site. */
export interface PublicMessageRequest {
  message: string;
}

export interface SupportTicketRequest {
  subject: string;
  body: string;
}

export interface SupportTicketDto {
  id: string;
  subject: string;
  body: string;
  status: SupportTicketStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
}
