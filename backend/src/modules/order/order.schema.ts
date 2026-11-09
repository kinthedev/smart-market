import { z } from "zod"

export const CreateOrderSchema = z.object({
	receiverName: z.string().trim().min(1, "Vui lòng nhập tên người nhận"),
	receiverPhone: z
		.string()
		.trim()
		.min(8, "Số điện thoại không hợp lệ")
		.max(15, "Số điện thoại không hợp lệ"),
	address: z.string().trim().min(5, "Vui lòng nhập địa chỉ giao hàng"),
	note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").optional().nullable(),
	items: z
		.array(
			z.object({
				productId: z.string().min(1, "Sản phẩm không hợp lệ"),
				quantity: z.number().int().min(1).max(99),
				size: z.string().optional().nullable(),
				color: z.string().optional().nullable(),
			}),
		)
		.min(1, "Đơn hàng phải có ít nhất một sản phẩm"),
})
