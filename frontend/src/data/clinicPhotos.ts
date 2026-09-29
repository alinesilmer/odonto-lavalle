const CLOUDINARY = "https://res.cloudinary.com/dcfkgepmp/image/upload";

/** Cloudinary serves the best format for the browser, compressed and resized. */
const photo = (path: string, width = 1400) => `${CLOUDINARY}/f_auto,q_auto,w_${width}/${path}`;

/** Real photos of the clinic and its team. */
export const CLINIC_PHOTOS = {
  /** Both dentists smiling together, in front of the clinic window. */
  team: photo("v1768581122/WhatsApp_Image_2026-01-16_at_1.16.16_PM_hlukdy.jpg"),
  /** Both dentists in the treatment room, with the "primer paso" message printed on top. */
  firstStep: photo("v1790685955/examp_yow197.png"),
  /** Both dentists, full length, by the frosted window with the logo. */
  teamWindow: photo("v1762121303/us-pic_dnusam.jpg"),
  /** A dentist treating a patient in the chair. */
  treatment: photo("v1768581282/WhatsApp_Image_2026-01-16_at_1.25.06_PM_ecq43f.jpg"),
  paula: photo("v1790686409/examp2_lztijl.png", 1000),
  florencia: photo("v1790686502/examp4_w1lt4l.png", 1000),
};
