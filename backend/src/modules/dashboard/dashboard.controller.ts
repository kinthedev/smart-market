import type { Request, Response } from "express"
import { isAdminEmail } from "../../lib/admin.js"
import { DashboardService } from "./dashboard.service.js"

export class DashboardController {
	static async getOverview(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền truy cập thống kê." })
			}

			const overview = await DashboardService.getOverview(
				typeof req.query.range === "string" ? req.query.range : undefined,
			)
			return res.status(200).json({ success: true, data: overview })
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error?.message || "Không thể tải dữ liệu tổng quan.",
			})
		}
	}
}
