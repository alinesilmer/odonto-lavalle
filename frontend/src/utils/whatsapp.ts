/** Digits only, which is what wa.me expects. */
export function normalizeWhatsappNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function buildWhatsappUrl(number: string, message?: string): string {
  const base = `https://wa.me/${normalizeWhatsappNumber(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** `noopener` matters here: the opened tab must not get a handle on ours. */
export function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
