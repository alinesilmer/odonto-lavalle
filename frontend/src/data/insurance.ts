import type { PaymentMethod } from "../types"

// The obras sociales themselves are site content: see DEFAULT_CONTENT in @odonto/shared.

export const paymentMethods: PaymentMethod[] = [
  { id: "1", name: "Tarjeta de crédito", icon: "card" },
  { id: "2", name: "Tarjeta de débito", icon: "card" },
  { id: "3", name: "Efectivo", icon: "cash" },
  { id: "4", name: "Transferencia", icon: "transfer" },
]
