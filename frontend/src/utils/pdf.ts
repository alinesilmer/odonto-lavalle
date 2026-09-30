/** A4 in CSS pixels at 96 dpi: the width the printed layout is designed for. */
const A4_WIDTH_PX = 794;
const MARGIN_MM = 12;

/**
 * Saves an on-page document (e.g. a PrintSheet) as an A4 PDF file.
 *
 * The PDF libraries are loaded here, on demand, so they never weigh on the
 * pages that don't use them. The element is copied into an off-screen,
 * A4-wide container so it renders the same whether it's hidden on screen
 * (print-only sheets are) or not; text lines aren't cut between pages.
 */
export async function downloadPdf(element: HTMLElement, filename: string): Promise<void> {
  const [{ jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas-pro")]);
  // jsPDF's html() looks for html2canvas on the window; the "pro" fork handles modern CSS colors.
  (window as unknown as { html2canvas: typeof html2canvas }).html2canvas = html2canvas;

  const frame = document.createElement("div");
  Object.assign(frame.style, { position: "fixed", left: "-10000px", top: "0", width: `${A4_WIDTH_PX}px`, background: "#ffffff" });
  const copy = element.cloneNode(true) as HTMLElement;
  // Print sheets are display:none on screen and get their type size from @media print.
  Object.assign(copy.style, { display: "block", fontSize: "10pt", lineHeight: "1.4", color: "#0e1620", printColorAdjust: "exact" });
  frame.appendChild(copy);
  document.body.appendChild(frame);

  try {
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const contentWidthMm = 210 - MARGIN_MM * 2;
    await pdf.html(copy, {
      margin: [MARGIN_MM, MARGIN_MM, MARGIN_MM + 2, MARGIN_MM],
      width: contentWidthMm,
      windowWidth: A4_WIDTH_PX,
      autoPaging: "text",
      html2canvas: { scale: contentWidthMm / A4_WIDTH_PX, useCORS: true, backgroundColor: "#ffffff" },
    });
    pdf.save(filename);
  } finally {
    frame.remove();
  }
}

/** "Aliné Silva" → "Ficha-Aliné-Silva-2026-09-29.pdf" (safe for any file system). */
export function pdfFilename(prefix: string, name: string, date = new Date()): string {
  const safe = `${prefix} ${name}`.trim().replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, "-");
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return `${safe}-${day}.pdf`;
}
