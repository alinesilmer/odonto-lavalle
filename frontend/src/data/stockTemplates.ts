/**
 * Ready-made stock items for a dental office with a chair and an X-ray unit
 * (consumables only; no large equipment). Picking one fills the "Agregar
 * producto" form; quantity and price are left for the clinic to enter.
 */
export interface StockTemplate {
  product: string;
  category: StockTemplateCategory;
  unit: string;
  /** Suggested low-stock threshold, in `unit`s. */
  minQuantity: number;
}

export const STOCK_TEMPLATE_CATEGORIES = [
  "Descartables",
  "Anestesia",
  "Restauración",
  "Endodoncia",
  "Radiología",
  "Esterilización e higiene",
  "Profilaxis y prevención",
  "Cirugía",
  "Impresión",
] as const;
export type StockTemplateCategory = (typeof STOCK_TEMPLATE_CATEGORIES)[number];

/** Units offered in the form: the templates' own plus the generic ones. */
export const STOCK_UNITS = ["Unidad", "Caja", "Pack", "Frasco", "Jeringa", "Rollo", "Sobre", "Litro", "ml", "gr"];

const t = (category: StockTemplateCategory, unit: string, minQuantity: number, ...products: string[]) =>
  products.map((product): StockTemplate => ({ product, category, unit, minQuantity }));

export const STOCK_TEMPLATES: StockTemplate[] = [
  ...t("Descartables", "Caja", 3, "Guantes de nitrilo talle S (x100)", "Guantes de nitrilo talle M (x100)", "Guantes de látex talle M (x100)"),
  ...t("Descartables", "Caja", 2, "Barbijos triple capa (x50)", "Cofias descartables (x100)"),
  ...t("Descartables", "Pack", 2, "Baberos descartables (x100)", "Eyectores de saliva (x100)", "Vasos descartables (x100)", "Rollos de algodón (x500)", "Gasas estériles 10x10 (x100)", "Puntas para jeringa triple (x100)"),
  ...t("Descartables", "Rollo", 1, "Film protector para superficies", "Papel camilla"),
  ...t("Anestesia", "Caja", 2, "Lidocaína 2% con epinefrina (x50 carpules)", "Articaína 4% con epinefrina (x50 carpules)", "Mepivacaína 3% sin vasoconstrictor (x50 carpules)"),
  ...t("Anestesia", "Caja", 1, "Agujas dentales cortas 30G (x100)", "Agujas dentales largas 27G (x100)"),
  ...t("Anestesia", "Frasco", 1, "Anestesia tópica en gel (benzocaína 20%)"),
  ...t("Restauración", "Jeringa", 2, "Resina compuesta A1", "Resina compuesta A2", "Resina compuesta A3", "Resina fluida A2", "Ácido grabador 37%"),
  ...t("Restauración", "Frasco", 1, "Adhesivo universal", "Ionómero vítreo de restauración", "Hidróxido de calcio", "Cemento provisorio"),
  ...t("Restauración", "Pack", 1, "Tiras de matriz metálicas", "Cuñas de madera", "Papel de articular", "Discos de pulido", "Tiras de lija interproximal"),
  ...t("Endodoncia", "Caja", 2, "Limas K 1ra serie 15-40 (x6)", "Limas K 2da serie 45-80 (x6)", "Conos de gutapercha surtidos (x120)", "Conos de papel surtidos (x200)"),
  ...t("Endodoncia", "Litro", 1, "Hipoclorito de sodio 2,5%"),
  ...t("Endodoncia", "Frasco", 1, "EDTA 17%", "Cemento sellador endodóntico", "Formocresol"),
  ...t("Radiología", "Caja", 1, "Películas radiográficas periapicales (x150)", "Películas oclusales (x25)"),
  ...t("Radiología", "Litro", 1, "Líquido revelador", "Líquido fijador"),
  ...t("Radiología", "Pack", 1, "Fundas protectoras para sensor (x500)", "Posicionadores radiográficos"),
  ...t("Esterilización e higiene", "Caja", 2, "Bolsas de esterilización 90x230 (x200)", "Bolsas de esterilización 135x280 (x200)"),
  ...t("Esterilización e higiene", "Rollo", 1, "Cinta testigo para autoclave"),
  ...t("Esterilización e higiene", "Pack", 1, "Indicadores biológicos"),
  ...t("Esterilización e higiene", "Litro", 2, "Alcohol al 70%", "Desinfectante de superficies", "Detergente enzimático", "Jabón antiséptico"),
  ...t("Profilaxis y prevención", "Frasco", 1, "Pasta profiláctica", "Flúor gel 1,23%", "Barniz de flúor", "Sellador de fosas y fisuras"),
  ...t("Profilaxis y prevención", "Pack", 1, "Cepillos para profilaxis (x100)", "Copas de goma para profilaxis (x100)", "Hilo dental"),
  ...t("Cirugía", "Caja", 1, "Hojas de bisturí N.º 15 (x100)", "Sutura seda 3-0 (x12)", "Sutura reabsorbible 4-0 (x12)"),
  ...t("Cirugía", "Unidad", 5, "Esponja hemostática"),
  ...t("Impresión", "Sobre", 2, "Alginato (450 gr)"),
  ...t("Impresión", "Pack", 1, "Cubetas descartables surtidas", "Silicona de condensación (pesada y liviana)"),
  ...t("Impresión", "Caja", 1, "Yeso piedra (1 kg)"),
];
