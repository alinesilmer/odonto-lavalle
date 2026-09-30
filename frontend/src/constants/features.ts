/**
 * Features that are built but switched off for now. Flip one to `true` when
 * its service is ready; the screens show a "coming soon" message meanwhile.
 */
export const FEATURES = {
  /**
   * Patient attachments (photos, X-rays, PDFs, spreadsheets). Off: file
   * storage needs a paid Firebase plan, and the project stays on free plans.
   * Turn on once uploads go to a free service (e.g. Cloudinary).
   */
  patientFiles: false,
} as const;
