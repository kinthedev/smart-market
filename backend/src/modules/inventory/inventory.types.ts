export const LOW_STOCK_THRESHOLD = 5

export type InventoryStockStatus = "out" | "low" | "in"

export interface InventoryQueryFilter {
	page?: number | string
	limit?: number | string
	search?: string
	stockStatus?: InventoryStockStatus | string
}

export interface UpdateStockInput {
	stock: number
}
