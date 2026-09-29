/** Filters on the Servicios page, and the readable name of each category. */
export const SERVICE_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "estetica", label: "Estética" },
  { id: "cirugia", label: "Cirugía" },
  { id: "tratamiento de conducto", label: "Endodoncia" },
  { id: "otros", label: "Generales" },
];

export const categoryLabel = (id: string): string =>
  SERVICE_FILTERS.find((filter) => filter.id === id)?.label ?? id;
