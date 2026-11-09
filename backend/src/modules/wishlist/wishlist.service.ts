import { prisma } from "../../lib/prisma.js"
import { withProductStats } from "../../lib/product-stats.js"

const productInclude = {
	category: true,
	images: { orderBy: { order: "asc" as const } },
	variants: true,
}

export class WishlistService {
	static async getWishlist(userId: string) {
		const rows = await prisma.wishlist.findMany({
			where: { userId },
			include: { product: { include: productInclude } },
			orderBy: { createdAt: "desc" },
		})

		const products = await withProductStats(rows.map((row) => row.product))

		return products.map((product) => ({
			...product,
			wishlistedAt:
				rows.find((row) => row.productId === product.id)?.createdAt ?? null,
		}))
	}

	static async getIds(userId: string) {
		const rows = await prisma.wishlist.findMany({
			where: { userId },
			select: { productId: true },
		})
		return rows.map((row) => row.productId)
	}

	static async add(userId: string, productId: string) {
		const product = await prisma.product.findUnique({
			where: { id: productId },
			select: { id: true },
		})

		if (!product) {
			throw new Error("Không tìm thấy sản phẩm.")
		}

		await prisma.wishlist.upsert({
			where: { userId_productId: { userId, productId } },
			create: { userId, productId },
			update: {},
		})

		const total = await prisma.wishlist.count({ where: { userId } })
		return { liked: true, total }
	}

	static async remove(userId: string, productId: string) {
		await prisma.wishlist.deleteMany({ where: { userId, productId } })
		const total = await prisma.wishlist.count({ where: { userId } })
		return { liked: false, total }
	}
}
