import type { Request, Response } from "express"
import { isAdminEmail } from "../../lib/admin.js"
import { CommentService } from "./comment.service.js"

export class CommentController {
	static async getComments(req: Request, res: Response) {
		try {
			const result = await CommentService.getComments(
				req.params.productId as string,
				req.query,
			)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async createComment(req: Request, res: Response) {
		try {
			const comment = await CommentService.createComment(
				req.user.id,
				req.params.productId as string,
				req.body.content,
			)
			return res.status(201).json({ success: true, data: comment })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async updateComment(req: Request, res: Response) {
		try {
			const comment = await CommentService.updateComment(
				req.params.id as string,
				req.user.id,
				req.body.content,
			)
			return res.status(200).json({ success: true, data: comment })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async deleteComment(req: Request, res: Response) {
		try {
			const result = await CommentService.deleteComment(
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

			const comment = await CommentService.setHidden(
				req.params.id as string,
				Boolean(req.body?.isHidden),
			)
			return res.status(200).json({ success: true, data: comment })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async getAllComments(req: Request, res: Response) {
		try {
			if (!isAdminEmail(req.user?.email)) {
				return res
					.status(403)
					.json({ success: false, message: "Không có quyền thực hiện thao tác này." })
			}

			const result = await CommentService.getAllComments(req.query)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}
}
