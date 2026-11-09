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

			if (product.variants.length > 0 && (item.size || item.color)) {
				const variant = product.variants.find(
					(v) =>
						(v.size ?? "") === (item.size ?? "") &&
						(v.color ?? "") === (item.color ?? ""),
				)

				if (variant && variant.stock > 0 && variant.stock < quantity) {
					throw new Error(`Sản phẩm "${product.name}" chỉ còn ${variant.stock} sản phẩm.`)
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

		return prisma.order.create({
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
		const limit = Math.max(1, Number(filter.limit) || 20)
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

		const [total, items] = await Promise.all([
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

		return prisma.order.update({
			where: { id },
			data: { status: status as any },
			include: { items: true },
		})
	}
}
