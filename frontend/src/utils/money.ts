const ARS = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

/** 30000 → "$ 30.000". */
export const formatPrice = (amount: number): string => ARS.format(amount);
