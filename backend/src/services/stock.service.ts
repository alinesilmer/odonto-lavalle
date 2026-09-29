import type { StockItemDto } from "@odonto/shared";
import { collections } from "../config/firebase.js";
import { createRepository } from "../lib/repository.js";
import { fieldsOf, iso, num, str } from "../lib/firestore.js";

export const stockRepo = createRepository<StockItemDto>(
  collections.stock,
  (snap) => {
    const d = fieldsOf(snap);
    return {
      id: snap.id,
      product: str(d.product),
      category: str(d.category),
      quantity: num(d.quantity),
      unit: str(d.unit),
      price: num(d.price),
      minQuantity: num(d.minQuantity),
      updatedAt: iso(d.updatedAt),
    };
  },
  "Producto no encontrado",
);

export const listStock = () => stockRepo.list((q) => q.orderBy("product"));
