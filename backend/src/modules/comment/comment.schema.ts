import { z } from "zod"

export const CreateCommentSchema = z.object({
	content: z
		.string()
		.trim()
		.min(1, "Vui lòng nhập nội dung bình luận")
		.max(1000, "Nội dung bình luận tối đa 1000 ký tự"),
})

export const UpdateCommentSchema = CreateCommentSchema
