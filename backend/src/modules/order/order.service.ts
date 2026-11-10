import { prisma } from "../../lib/prisma.js"
import type { CreateOrderInput, OrderQueryFilter } from "./order.types.js"

function generateOrderCode() {
	const now = new Date()
	const stamp = [
		now.getFullYear(),
		String(now.getMonth() + 1).padStart(2, "0"),
		String(now.getDate()).padStart(2, "0"),
		String(now.getHours()).padStart(2, "0"),
		String(now.getMinutes()).padStart(2, "0"),
		String(now.getSeconds()).padStart(2, "0"),
	].join("")
	const random = Math.random().toString(36).slice(2, 6).toUpperCase()
	return `SM-${stamp}-${random}`
}

export class OrderService {
	static async createOrder(userId: string, input: CreateOrderInput) {
		if (!input.items?.length) {
			throw new Error("Đơn hàng phải có ít nhất một sản phẩm.")
		}

		const productIds = [...new Set(input.items.map((item) => item.productId))]

		const products = await prisma.product.findMany({
			where: { id: { in: productIds } },
			include: {
				images: { orderBy: { order: "asc" } },
				variants: true,
			},
		})

		const productMap = new Map(products.map((product) => [product.id, product]))
		let total = 0

		// Tổng số lượng cần trừ theo từng biến thể (gộp nếu khách mua trùng biến thể ở nhiều dòng)
		const stockChanges = new Map<
			string,
			{ variantId: string; productName: string; quantity: number }
		>()

		const orderItems = input.items.map((item) => {
			const product = productMap.get(item.productId)

			if (!product) {
				throw new Error("Có sản phẩm không tồn tại trong đơn hàng.")
			}

			if (product.status !== "ACTIVE") {
				throw new Error(`Sản phẩm "${product.name}" hiện không còn bán.`)
			}

			const quantity = Math.max(1, Math.min(99, Number(item.quantity) || 1))
			const hasSalePrice =
				product.salePrice != null && product.salePrice < product.price
			const price = hasSalePrice ? (product.salePrice as number) : product.price

			// Sản phẩm có biến thể bắt buộc phải chọn đúng phân loại để trừ tồn kho
			if (product.variants.length > 0) {
				const variant = product.variants.find(
					(v) =>
						(v.size ?? "") === (item.size ?? "") &&
						(v.color ?? "") === (item.color ?? ""),
				)

				if (!variant) {
					throw new Error(
						`Vui lòng chọn phân loại (kích thước/màu sắc) cho sản phẩm "${product.name}".`,
					)
				}

				if (variant.stock <= 0) {
					throw new Error(`Sản phẩm "${product.name}" đã hết hàng.`)
				}

				if (variant.stock < quantity) {
					throw new Error(
						`Sản phẩm "${product.name}" chỉ còn ${variant.stock} sản phẩm.`,
					)
				}

				const current = stockChanges.get(variant.id)
				if (current) {
					current.quantity += quantity
				} else {
					stockChanges.set(variant.id, {
						variantId: variant.id,
						productName: product.name,
						quantity,
					})
				}
			}

			total += price * quantity

			return {
				productId: product.id,
				name: product.name,
				image: product.images[0]?.url,
				price,
				size: item.size || null,
				color: item.color || null,
				quantity,
			}
		})

		// Tạo đơn và trừ kho trong cùng một transaction để tránh bán vượt tồn kho
		return prisma.$transaction(async (tx) => {
			for (const change of stockChanges.values()) {
				const updated = await tx.productVariant.updateMany({
					where: {
						id: change.variantId,
						stock: { gte: change.quantity },
					},
					data: { stock: { decrement: change.quantity } },
				})

				if (updated.count === 0) {
					throw new Error(
						`Sản phẩm "${change.productName}" vừa hết hàng, vui lòng thử lại.`,
					)
				}
			}

			return tx.order.create({
				data: {
					code: generateOrderCode(),
					userId,
					status: "CONFIRMED",
					total,
					receiverName: input.receiverName,
					receiverPhone: input.receiverPhone,
					address: input.address,
					note: input.note || null,
					items: { create: orderItems },
				},
				include: { items: true },
			})
		})
	}

	static async getMyOrders(userId: string) {
		return prisma.order.findMany({
			where: { userId },
			include: { items: true },
			orderBy: { createdAt: "desc" },
		})
	}

	static async getOrderById(id: string) {
		return prisma.order.findUnique({
			where: { id },
			include: { items: true },
		})
	}

	static async getAllOrders(filter: OrderQueryFilter) {
		const page = Math.max(1, Number(filter.page) || 1)
		const limit = Math.max(1, Math.min(100, Number(filter.limit) || 20))
		const skip = (page - 1) * limit

		const where: any = {}

		if (filter.status) {
			where.status = filter.status
		}

		if (filter.search) {
			where.OR = [
				{ code: { contains: filter.search, mode: "insensitive" } },
				{ receiverName: { contains: filter.search, mode: "insensitive" } },
				{ receiverPhone: { contains: filter.search, mode: "insensitive" } },
				{ user: { email: { contains: filter.search, mode: "insensitive" } } },
			]
		}

		const [total, items, statusGroups] = await Promise.all([
			prisma.order.count({ where }),
			prisma.order.findMany({
				where,
				include: {
					items: true,
					user: { select: { id: true, name: true, email: true } },
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limit,
			}),
			prisma.order.groupBy({
				by: ["status"],
				_count: { _all: true },
			}),
		])

		// Thống kê toàn bộ đơn hàng theo trạng thái (không phụ thuộc bộ lọc hiện tại)
		const stats = {
			total: 0,
			pending: 0,
			confirmed: 0,
			shipping: 0,
			delivered: 0,
			cancelled: 0,
		}

		for (const group of statusGroups) {
			const count = group._count._all
			stats.total += count

			if (group.status === "PENDING") stats.pending = count
			else if (group.status === "CONFIRMED") stats.confirmed = count
			else if (group.status === "SHIPPING") stats.shipping = count
			else if (group.status === "DELIVERED") stats.delivered = count
			else if (group.status === "CANCELLED") stats.cancelled = count
		}

		return {
			items,
			stats,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		}
	}

	static async updateStatus(id: string, status: string) {
		const allowed = [
			"PENDING",
			"CONFIRMED",
			"SHIPPING",
			"DELIVERED",
			"CANCELLED",
		]

		if (!allowed.includes(status)) {
			throw new Error("Trạng thái đơn hàng không hợp lệ.")
		}

		return prisma.$transaction(async (tx) => {
			const order = await tx.order.findUnique({
				where: { id },
				include: { items: true },
			})

			if (!order) {
				throw new Error("Không tìm thấy đơn hàng.")
			}

			if (order.status === status) {
				return order
			}

			// Hủy đơn => hoàn lại tồn kho cho từng biến thể đã mua
			if (status === "CANCELLED") {
				for (const item of order.items) {
					await tx.productVariant.updateMany({
						where: {
							productId: item.productId,
							size: item.size,
							color: item.color,
						},
						data: { stock: { increment: item.quantity } },
					})
				}
			}

			// Mở lại đơn đã hủy => phải trừ lại kho (nếu còn đủ hàng)
			if (order.status === "CANCELLED" && status !== "CANCELLED") {
				for (const item of order.items) {
					const variant = await tx.productVariant.findFirst({
						where: {
							productId: item.productId,
							size: item.size,
							color: item.color,
						},
					})

					if (!variant) continue

					if (variant.stock < item.quantity) {
						throw new Error(
							`Sản phẩm "${item.name}" không còn đủ tồn kho để mở lại đơn hàng.`,
						)
					}

					await tx.productVariant.updateMany({
						where: {
							id: variant.id,
							stock: { gte: item.quantity },
						},
						data: { stock: { decrement: item.quantity } },
					})
				}
			}

			return tx.order.update({
				where: { id },
				data: { status: status as any },
				include: { items: true },
			})
		})
	}
}
