import { prisma } from "../../lib/prisma.js"
import type {
	AdminReviewQueryFilter,
	CreateReviewInput,
	ReviewQueryFilter,
} from "./review.types.js"

const userSelect = {
	id: true,
	name: true,
	email: true,
	image: true,
}

export class ReviewService {
	static async getMyReviews(userId: string) {
		return prisma.review.findMany({
			where: { userId },
			include: {
				user: { select: userSelect },
				product: {
					select: {
						id: true,
						name: true,
						slug: true,
						images: { take: 1, select: { url: true } },
					},
				},
			},
			orderBy: { createdAt: "desc" },
		})
	}

	/** Kiểm tra người dùng đã có đơn hàng hợp lệ chứa sản phẩm này chưa. */
	static async hasPurchased(userId: string, productId: string) {
		const item = await prisma.orderItem.findFirst({
			where: {
				productId,
				order: {
					userId,
					status: { in: ["CONFIRMED", "SHIPPING", "DELIVERED"] },
				},
			},
			select: { id: true },
		})

		return Boolean(item)
	}

	static async getReviews(productId: string, filter: ReviewQueryFilter) {
		const page = Math.max(1, Number(filter.page) || 1)
		const limit = Math.max(1, Math.min(50, Number(filter.limit) || 10))
		const skip = (page - 1) * limit

		const where: any = { productId, isHidden: false }

		const rating = Number(filter.rating)
		if (rating >= 1 && rating <= 5) {
			where.rating = rating
		}

		const [total, items] = await Promise.all([
			prisma.review.count({ where }),
			prisma.review.findMany({
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

	static async getSummary(productId: string, userId?: string) {
		const [aggregate, groups, myReview] = await Promise.all([
			prisma.review.aggregate({
				where: { productId, isHidden: false },
				_avg: { rating: true },
				_count: { _all: true },
			}),
			prisma.review.groupBy({
				by: ["rating"],
				where: { productId, isHidden: false },
				_count: { _all: true },
			}),
			userId
				? prisma.review.findUnique({
						where: { userId_productId: { userId, productId } },
						include: { user: { select: userSelect } },
					})
				: Promise.resolve(null),
		])

		const histogram: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
		for (const group of groups) {
			histogram[group.rating] = group._count._all
		}

		const purchased = userId ? await ReviewService.hasPurchased(userId, productId) : false

		return {
			ratingAvg: Number((aggregate._avg.rating ?? 0).toFixed(1)),
			reviewCount: aggregate._count._all,
			histogram,
			purchased,
			canReview: purchased && !myReview,
			myReview,
		}
	}

	static async createReview(
		userId: string,
		productId: string,
		input: CreateReviewInput,
	) {
		const purchased = await ReviewService.hasPurchased(userId, productId)
		if (!purchased) {
			throw new Error("Bạn cần mua sản phẩm này để có thể đánh giá.")
		}

		const existing = await prisma.review.findUnique({
			where: { userId_productId: { userId, productId } },
			select: { id: true },
		})

		if (existing) {
			throw new Error("Bạn đã đánh giá sản phẩm này rồi.")
		}

		return prisma.review.create({
			data: {
				userId,
				productId,
				rating: input.rating,
				content: input.content?.trim() || null,
			},
			include: { user: { select: userSelect } },
		})
	}

	static async updateReview(
		id: string,
		userId: string,
		input: Partial<CreateReviewInput>,
	) {
		const review = await prisma.review.findUnique({ where: { id } })
		if (!review) {
			throw new Error("Không tìm thấy đánh giá.")
		}
		if (review.userId !== userId) {
			throw new Error("Bạn không có quyền sửa đánh giá này.")
		}

		return prisma.review.update({
			where: { id },
			data: {
				...(input.rating != null ? { rating: input.rating } : {}),
				...(input.content !== undefined
					? { content: input.content?.trim() || null }
					: {}),
			},
			include: { user: { select: userSelect } },
		})
	}

	static async deleteReview(id: string, userId: string, isAdmin: boolean) {
		const review = await prisma.review.findUnique({ where: { id } })
		if (!review) {
			throw new Error("Không tìm thấy đánh giá.")
		}
		if (!isAdmin && review.userId !== userId) {
			throw new Error("Bạn không có quyền xoá đánh giá này.")
		}

		await prisma.review.delete({ where: { id } })
		return { id }
	}

	static async setHidden(id: string, isHidden: boolean) {
		return prisma.review.update({
			where: { id },
			data: { isHidden },
		})
	}

	static async getAllReviews(filter: AdminReviewQueryFilter) {
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

		const rating = Number(filter.rating)
		if (rating >= 1 && rating <= 5) {
			where.rating = rating
		}

		if (filter.isHidden === "true" || filter.isHidden === "false") {
			where.isHidden = filter.isHidden === "true"
		}

		const [total, items, aggregate, hiddenCount] = await Promise.all([
			prisma.review.count({ where }),
			prisma.review.findMany({
				where,
				include: {
					user: { select: userSelect },
					product: {
						select: {
							id: true,
							name: true,
							slug: true,
							images: { take: 1, select: { url: true } },
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.review.aggregate({
				_avg: { rating: true },
				_count: { _all: true },
			}),
			prisma.review.count({ where: { isHidden: true } }),
		])

		return {
			items,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
			stats: {
				totalAll: aggregate._count._all || 0,
				avgRating: Number((aggregate._avg.rating || 0).toFixed(1)),
				hiddenCount,
			},
		}
	}
}
