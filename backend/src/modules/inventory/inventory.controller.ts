import type { Request, Response } from "express"
import { isAdminEmail } from "../../lib/admin.js"
import { InventoryService } from "./inventory.service.js"

export class InventoryController {
	static async getAll(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const result = await InventoryService.getInventory(req.query)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async updateStock(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const variant = await InventoryService.updateVariantStock(
				req.params.id as string,
				req.body.stock,
			)
			return res.status(200).json({ success: true, data: variant })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}
}
