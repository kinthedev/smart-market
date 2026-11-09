import type { Request, Response } from "express"
import { isAdminEmail } from "../../lib/admin.js"
import { OrderService } from "./order.service.js"

export class OrderController {
	static async createOrder(req: Request, res: Response) {
		try {
			const order = await OrderService.createOrder(req.user.id, req.body)
			return res.status(201).json({ success: true, data: order })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async getMyOrders(req: Request, res: Response) {
		try {
			const orders = await OrderService.getMyOrders(req.user.id)
			return res.status(200).json({ success: true, data: orders })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getOrderById(req: Request, res: Response) {
		try {
			const order = await OrderService.getOrderById(req.params.id as string)

			if (!order) {
				return res
					.status(404)
					.json({ success: false, message: "Không tìm thấy đơn hàng." })
			}

			if (order.userId !== req.user.id && !isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Bạn không có quyền xem đơn hàng này." })
			}

			return res.status(200).json({ success: true, data: order })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getAllOrders(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const result = await OrderService.getAllOrders(req.query)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async updateStatus(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const order = await OrderService.updateStatus(
				req.params.id as string,
				req.body?.status,
			)
			return res.status(200).json({ success: true, data: order })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}
}
