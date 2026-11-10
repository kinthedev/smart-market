import { prisma } from "../../lib/prisma.js"
import { LOW_STOCK_THRESHOLD } from "./inventory.types.js"
import type { InventoryQueryFilter } from "./inventory.types.js"

const productSelect = {
	id: true,
	name: true,
	sku: true,
	status: true,
	images: {
		orderBy: { order: "asc" as const },
		take: 1,
	},
}

export class InventoryService {
	static async getInventory(filter: InventoryQueryFilter) {
		const page = Math.max(1, Number(filter.page) || 1)
		const limit = Math.max(1, Math.min(100, Number(filter.limit) || 20))
		const skip = (page - 1) * limit

		const where: any = {}

		if (filter.search?.trim()) {
			const search = filter.search.trim()
			where.OR = [
				{ product: { name: { contains: search, mode: "insensitive" } } },
				{ product: { sku: { contains: search, mode: "insensitive" } } },
				{ size: { contains: search, mode: "insensitive" } },
				{ color: { contains: search, mode: "insensitive" } },
			]
		}

		if (filter.stockStatus === "out") {
			where.stock = { lte: 0 }
		} else if (filter.stockStatus === "low") {
			where.stock = { gt: 0, lte: LOW_STOCK_THRESHOLD }
		} else if (filter.stockStatus === "in") {
			where.stock = { gt: LOW_STOCK_THRESHOLD }
		}

		const [total, items, stockSum, totalVariants, lowStock, outOfStock] =
			await Promise.all([
				prisma.productVariant.count({ where }),
				prisma.productVariant.findMany({
					where,
					include: { product: { select: productSelect } },
					orderBy: [{ stock: "asc" }, { product: { name: "asc" } }],
					skip,
					take: limit,
				}),
				prisma.productVariant.aggregate({ _sum: { stock: true } }),
				prisma.productVariant.count(),
				prisma.productVariant.count({
					where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } },
				}),
				prisma.productVariant.count({ where: { stock: { lte: 0 } } }),
			])

		return {
			items,
			stats: {
				totalVariants,
				totalStock: stockSum._sum.stock ?? 0,
				lowStock,
				outOfStock,
				lowStockThreshold: LOW_STOCK_THRESHOLD,
			},
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	static async updateVariantStock(id: string, stock: number) {
		const variant = await prisma.productVariant.findUnique({ where: { id } })

		if (!variant) {
			throw new Error("Không tìm thấy biến thể sản phẩm cần cập nhật.")
		}

		return prisma.productVariant.update({
			where: { id },
			data: { stock },
			include: { product: { select: productSelect } },
		})
	}
}
