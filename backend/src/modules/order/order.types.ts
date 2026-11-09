export interface CreateOrderItemInput {
	productId: string
	quantity: number
	size?: string | null
	color?: string | null
}

export interface CreateOrderInput {
	receiverName: string
	receiverPhone: string
	address: string
	note?: string | null
	items: CreateOrderItemInput[]
}

export interface OrderQueryFilter {
	page?: number | string
	limit?: number | string
	status?: string
	search?: string
}
