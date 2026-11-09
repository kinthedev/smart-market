import { prisma } from "../../lib/prisma.js"
import type {
	AdminCommentQueryFilter,
	CommentQueryFilter,
} from "./comment.types.js"

const userSelect = {
	id: true,
	name: true,
	email: true,
	image: true,
}

export class CommentService {
	static async getComments(productId: string, filter: CommentQueryFilter) {
		const page = Math.max(1, Number(filter.page) || 1)
		const limit = Math.max(1, Math.min(50, Number(filter.limit) || 10))
		const skip = (page - 1) * limit

		const where = { productId, isHidden: false }

		const [total, items] = await Promise.all([
			prisma.comment.count({ where }),
			prisma.comment.findMany({
				where,
				include: { user: { select: userSelect } },
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
		])

		return {
			items,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	static async createComment(
		userId: string,
		productId: string,
		content: string,
	) {
		const product = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true },
		})

		if (!product) {
			throw new Error("Không tìm thấy sản phẩm.")
		}

		return prisma.comment.create({
			data: { userId, productId, content: content.trim() },
			include: { user: { select: userSelect } },
		})
	}

	static async updateComment(id: string, userId: string, content: string) {
		const comment = await prisma.comment.findUnique({ where: { id } })
		if (!comment) {
			throw new Error("Không tìm thấy bình luận.")
		}
		if (comment.userId !== userId) {
			throw new Error("Bạn không có quyền sửa bình luận này.")
		}

		return prisma.comment.update({
			where: { id },
			data: { content: content.trim() },
			include: { user: { select: userSelect } },
		})
	}

	static async deleteComment(id: string, userId: string, isAdmin: boolean) {
		const comment = await prisma.comment.findUnique({ where: { id } })
		if (!comment) {
			throw new Error("Không tìm thấy bình luận.")
		}
		if (!isAdmin && comment.userId !== userId) {
			throw new Error("Bạn không có quyền xoá bình luận này.")
		}

		await prisma.comment.delete({ where: { id } })
		return { id }
	}

	static async setHidden(id: string, isHidden: boolean) {
		return prisma.comment.update({
			where: { id },
			data: { isHidden },
		})
	}

	static async getAllComments(filter: AdminCommentQueryFilter) {
		const page = Math.max(1, Number(filter.page) || 1)
		const limit = Math.max(1, Math.min(50, Number(filter.limit) || 20))
		const skip = (page - 1) * limit

		const where: any = {}

		if (filter.search) {
			where.OR = [
				{ content: { contains: filter.search, mode: "insensitive" } },
				{ user: { name: { contains: filter.search, mode: "insensitive" } } },
				{ user: { email: { contains: filter.search, mode: "insensitive" } } },
				{ product: { name: { contains: filter.search, mode: "insensitive" } } },
			]
		}

		if (filter.isHidden === "true" || filter.isHidden === "false") {
			where.isHidden = filter.isHidden === "true"
		}

		const [total, items] = await Promise.all([
			prisma.comment.count({ where }),
			prisma.comment.findMany({
				where,
				include: {
					user: { select: userSelect },
					product: { select: { id: true, name: true, slug: true } },
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
		])

		return {
			items,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}
}
