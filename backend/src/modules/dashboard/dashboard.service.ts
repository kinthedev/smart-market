import { prisma } from "../../lib/prisma.js"
import { LOW_STOCK_THRESHOLD } from "../inventory/inventory.types.js"
import type {
	DashboardOverview,
	DashboardRange,
	DashboardRevenuePoint,
	DashboardStatusCount,
} from "./dashboard.types.js"

const STATUS_LABELS: Record<string, string> = {
	PENDING: "Chờ xác nhận",
	CONFIRMED: "Đã xác nhận",
	SHIPPING: "Đang giao",
	DELIVERED: "Đã giao",
	CANCELLED: "Đã hủy",
}

const VALID_RANGES: DashboardRange[] = ["today", "7d", "30d", "month", "year"]

function normalizeRange(value?: string): DashboardRange {
	return VALID_RANGES.includes(value as DashboardRange)
		? (value as DashboardRange)
		: "30d"
}

function pad(value: number) {
	return String(value).padStart(2, "0")
}

function getRangeStart(range: DashboardRange): Date {
	const now = new Date()
	const start = new Date(now)
	start.setHours(0, 0, 0, 0)

	switch (range) {
		case "today":
			break
		case "7d":
			start.setDate(start.getDate() - 6)
			break
		case "30d":
			start.setDate(start.getDate() - 29)
			break
		case "month":
			start.setDate(1)
			break
		case "year":
			start.setMonth(0, 1)
			break
	}

	return start
}

/** Tạo các mốc thời gian (ngày hoặc tháng) để vẽ biểu đồ doanh thu. */
function buildBuckets(range: DashboardRange, start: Date) {
	const now = new Date()
	const buckets: Array<DashboardRevenuePoint & { key: string }> = []

	if (range === "year") {
		for (let month = 0; month < 12; month += 1) {
			buckets.push({
				key: `${now.getFullYear()}-${pad(month + 1)}`,
				label: `T${month + 1}`,
				revenue: 0,
				orders: 0,
			})
		}
		return buckets
	}

	const cursor = new Date(start)
	while (cursor.getTime() <= now.getTime()) {
		const year = cursor.getFullYear()
		const month = cursor.getMonth() + 1
		const day = cursor.getDate()
		buckets.push({
			key: `${year}-${pad(month)}-${pad(day)}`,
			label: `${pad(day)}/${pad(month)}`,
			revenue: 0,
			orders: 0,
		})
		cursor.setDate(cursor.getDate() + 1)
	}

	return buckets
}

function bucketKeyByDate(date: Date, range: DashboardRange) {
	const year = date.getFullYear()
	const month = pad(date.getMonth() + 1)
	if (range === "year") return `${year}-${month}`
	return `${year}-${month}-${pad(date.getDate())}`
}

export class DashboardService {
	static async getOverview(rawRange?: string): Promise<DashboardOverview> {
		const range = normalizeRange(rawRange)
		const start = getRangeStart(range)

		const [ordersInRange, pendingOrders, customers, totalProducts, lowStock, statusGroups, soldItems, recentOrders] =
			await Promise.all([
				prisma.order.findMany({
					where: { createdAt: { gte: start } },
					select: { total: true, status: true, createdAt: true },
				}),
				prisma.order.count({ where: { status: "PENDING" } }),
				prisma.user.count(),
				prisma.product.count(),
				prisma.productVariant.count({
					where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } },
				}),
				prisma.order.groupBy({
					by: ["status"],
					where: { createdAt: { gte: start } },
					_count: { _all: true },
				}),
				prisma.orderItem.findMany({
					where: {
						order: {
							createdAt: { gte: start },
							status: { not: "CANCELLED" },
						},
					},
					select: {
						productId: true,
						name: true,
						price: true,
						quantity: true,
					},
				}),
				prisma.order.findMany({
					take: 6,
					orderBy: { createdAt: "desc" },
					select: {
						id: true,
						code: true,
						receiverName: true,
						total: true,
						status: true,
						createdAt: true,
					},
				}),
			])

		// Doanh thu chỉ tính các đơn không bị huỷ
		const validOrders = ordersInRange.filter((order) => order.status !== "CANCELLED")
		const revenue = validOrders.reduce((sum, order) => sum + order.total, 0)

		// Biểu đồ doanh thu theo ngày/tháng
		const buckets = buildBuckets(range, start)
		const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]))

		for (const order of validOrders) {
			const bucket = bucketMap.get(bucketKeyByDate(order.createdAt, range))
			if (!bucket) continue
			bucket.revenue += order.total
			bucket.orders += 1
		}

		// Sản phẩm đã bán & top sản phẩm bán chạy
		const productMap = new Map<
			string,
			{ productId: string; name: string; sold: number; revenue: number }
		>()

		let productsSold = 0
		for (const item of soldItems) {
			productsSold += item.quantity
			const current = productMap.get(item.productId) ?? {
				productId: item.productId,
				name: item.name,
				sold: 0,
				revenue: 0,
			}
			current.sold += item.quantity
			current.revenue += item.price * item.quantity
			productMap.set(item.productId, current)
		}

		const topProducts = Array.from(productMap.values())
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 5)

		const ordersByStatus: DashboardStatusCount[] = statusGroups
			.map((group) => ({
				status: group.status,
				label: STATUS_LABELS[group.status] ?? group.status,
				count: group._count._all,
			}))
			.sort((a, b) => b.count - a.count)

		return {
			range,
			stats: {
				revenue,
				orders: ordersInRange.length,
				productsSold,
				customers,
				pendingOrders,
				lowStock,
				totalProducts,
			},
			revenueSeries: buckets.map(({ key, ...point }) => point),
			ordersByStatus,
			topProducts,
			recentOrders: recentOrders.map((order) => ({
				...order,
				createdAt: order.createdAt.toISOString(),
			})),
		}
	}
}
