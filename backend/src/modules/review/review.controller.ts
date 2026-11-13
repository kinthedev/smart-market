import type { Request, Response } from "express"
import { isAdminEmail } from "../../lib/admin.js"
import { ReviewService } from "./review.service.js"

export class ReviewController {
	static async getMyReviews(req: Request, res: Response) {
		try {
			const reviews = await ReviewService.getMyReviews(req.user.id)
			return res.status(200).json({ success: true, data: reviews })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getReviews(req: Request, res: Response) {
		try {
			const result = await ReviewService.getReviews(
				req.params.productId as string,
				req.query,
			)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getSummary(req: Request, res: Response) {
		try {
			const summary = await ReviewService.getSummary(
				req.params.productId as string,
				req.user?.id,
			)
			return res.status(200).json({ success: true, data: summary })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async createReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.createReview(
				req.user.id,
				req.params.productId as string,
				req.body,
			)
			return res.status(201).json({ success: true, data: review })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async updateReview(req: Request, res: Response) {
		try {
			const review = await ReviewService.updateReview(
				req.params.id as string,
				req.user.id,
				req.body,
			)
			return res.status(200).json({ success: true, data: review })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async deleteReview(req: Request, res: Response) {
		try {
			const result = await ReviewService.deleteReview(
				req.params.id as string,
				req.user.id,
				isAdminEmail(req.user?.email),
			)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async setHidden(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const review = await ReviewService.setHidden(
				req.params.id as string,
				Boolean(req.body?.isHidden),
			)
			return res.status(200).json({ success: true, data: review })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async getAllReviews(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const result = await ReviewService.getAllReviews(req.query)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
}
