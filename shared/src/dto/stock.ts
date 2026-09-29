export interface StockItemDto {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minQuantity: number;
  updatedAt: string;
}

export type UpsertStockItemRequest = Omit<StockItemDto, "id" | "updatedAt">;
