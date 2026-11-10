export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  images: Array<{ id: string; url: string; altText?: string | null; order: number }>;
}

export interface InventoryVariant {
  id: string;
  productId: string;
  size?: string | null;
  color?: string | null;
  stock: number;
  product: InventoryProduct;
}

export interface InventoryStats {
  totalVariants: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  lowStockThreshold: number;
}

export interface InventoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InventoryResult {
  items: InventoryVariant[];
  stats: InventoryStats;
  pagination: InventoryPagination;
}

export type InventoryStockStatus = "ALL" | "in" | "low" | "out";

export interface InventoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  stockStatus?: Exclude<InventoryStockStatus, "ALL">;
}
