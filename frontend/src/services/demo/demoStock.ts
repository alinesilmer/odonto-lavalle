import type { StockItemDto, UpsertStockItemRequest } from "@odonto/shared";
import { NOT_MINE } from "./demoContent";

/** Demo answers for /stock: a few usual supplies (two running low), kept in memory. */
const now = new Date().toISOString();
const item = (id: number, product: string, category: string, quantity: number, unit: string, price: number, minQuantity: number): StockItemDto => ({
  id: `demo-s${id}`,
  product,
  category,
  quantity,
  unit,
  price,
  minQuantity,
  updatedAt: now,
});

let stock: StockItemDto[] = [
  item(1, "Guantes de nitrilo talle M (x100)", "Descartables", 6, "Caja", 9800, 3),
  item(2, "Lidocaína 2% con epinefrina (x50 carpules)", "Anestesia", 1, "Caja", 42000, 2),
  item(3, "Resina compuesta A2", "Restauración", 4, "Jeringa", 18500, 2),
  item(4, "Bolsas de esterilización 90x230 (x200)", "Esterilización e higiene", 2, "Caja", 15600, 2),
  item(5, "Eyectores de saliva (x100)", "Descartables", 5, "Pack", 4300, 2),
];

export function handleDemoStock(method: string, route: string, body: unknown): unknown {
  const match = route.match(/^\/stock(?:\/([^/]+))?$/);
  if (!match) return NOT_MINE;
  const id = match[1];
  const stamp = new Date().toISOString();

  if (!id) {
    if (method === "POST") {
      const created = { ...(body as UpsertStockItemRequest), id: `demo-s${Date.now()}`, updatedAt: stamp };
      stock = [...stock, created];
      return created;
    }
    return { items: [...stock].sort((a, b) => a.product.localeCompare(b.product)) };
  }
  if (method === "DELETE") {
    stock = stock.filter((s) => s.id !== id);
    return undefined;
  }
  stock = stock.map((s) => (s.id === id ? { ...s, ...(body as UpsertStockItemRequest), updatedAt: stamp } : s));
  return stock.find((s) => s.id === id);
}

/** Items at or under their minimum, like the API's summary counts them. */
export const lowStockCount = () => stock.filter((s) => s.quantity <= s.minQuantity).length;
