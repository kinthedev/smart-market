import { prisma } from "./prisma.js"

export type ProductStats = {
	ratingAvg: number
	reviewCount: number
}

/**
 * Gắn điểm đánh giá trung bình và số lượt đánh giá
 * vào danh sách sản phẩm (chỉ tính các mục không bị ẩn).
 */
export async function withProductStats<T extends { id: string }>(
	items: T[],
): Promise<Array<T & ProductStats>> {
	if (!items.length) return []

	const ids = items.map((item) => item.id)

	const reviewGroups = await prisma.review.groupBy({
		by: ["productId"],
		where: { productId: { in: ids }, isHidden: false },
		_avg: { rating: true },
		_count: { _all: true },
	})

	const reviewMap = new Map(
		reviewGroups.map((group) => [
			group.productId,
			{
				ratingAvg: Number((group._avg.rating ?? 0).toFixed(1)),
				reviewCount: group._count._all,
			},
		]),
	)

	return items.map((item) => {
		const review = reviewMap.get(item.id)
		return {
			...item,
			ratingAvg: review?.ratingAvg ?? 0,
			reviewCount: review?.reviewCount ?? 0,
		}
	})
}
