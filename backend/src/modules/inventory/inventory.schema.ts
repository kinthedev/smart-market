import { z } from "zod"

export const UpdateStockSchema = z.object({
	stock: z.coerce
		.number()
		.int("Số lượng tồn kho phải là số nguyên.")
		.min(0, "Số lượng tồn kho không được âm.")
		.max(999999, "Số lượng tồn kho quá lớn."),
})
