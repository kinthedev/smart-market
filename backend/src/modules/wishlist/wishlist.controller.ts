import type { Request, Response } from "express"
import { WishlistService } from "./wishlist.service.js"

export class WishlistController {
	static async getWishlist(req: Request, res: Response) {
		try {
			const items = await WishlistService.getWishlist(req.user.id)
			return res.status(200).json({ success: true, data: items })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getIds(req: Request, res: Response) {
		try {
			const ids = await WishlistService.getIds(req.user.id)
			return res.status(200).json({ success: true, data: ids })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async add(req: Request, res: Response) {
		try {
			const result = await WishlistService.add(
				req.user.id,
				req.params.productId as string,
			)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async remove(req: Request, res: Response) {
		try {
			const result = await WishlistService.remove(
				req.user.id,
				req.params.productId as string,
			)
			return res.status(200).json({ success: true, data: result })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}
}
