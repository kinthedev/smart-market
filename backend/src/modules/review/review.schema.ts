import { z } from "zod"

export const CreateReviewSchema = z.object({
	rating: z
		.number()
		.int("Số sao phải là số nguyên")
		.min(1, "Vui lòng chọn từ 1 đến 5 sao")
		.max(5, "Vui lòng chọn từ 1 đến 5 sao"),
	content: z
		.string()
		.trim()
		.max(1000, "Nội dung đánh giá tối đa 1000 ký tự")
		.optional()
		.nullable(),
})

export const UpdateReviewSchema = CreateReviewSchema.partial()
