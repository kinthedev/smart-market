import type { Request, Response } from "express"
import { AccountService } from "./account.service.js"

export class AccountController {
	static async getAddresses(req: Request, res: Response) {
		try {
			const addresses = await AccountService.getAddresses(req.user.id)
			return res.status(200).json({ success: true, data: addresses })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async getDefaultAddress(req: Request, res: Response) {
		try {
			const address = await AccountService.getDefaultAddress(req.user.id)
			return res.status(200).json({ success: true, data: address })
		} catch (error: any) {
			return res.status(500).json({ success: false, message: error.message })
		}
	}

	static async createAddress(req: Request, res: Response) {
		try {
			const address = await AccountService.createAddress(req.user.id, req.body)
			return res.status(201).json({ success: true, data: address })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async updateAddress(req: Request, res: Response) {
		try {
			const address = await AccountService.updateAddress(
				req.user.id,
				req.params.id as string,
				req.body,
			)
			return res.status(200).json({ success: true, data: address })
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async deleteAddress(req: Request, res: Response) {
		try {
			const result = await AccountService.deleteAddress(
				req.user.id,
				req.params.id as string,
			)
			return res.status(200).json({
				success: true,
				data: result,
				message: "Đã xóa thông tin người nhận.",
			})
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}

	static async setDefaultAddress(req: Request, res: Response) {
		try {
			const address = await AccountService.setDefaultAddress(
				req.user.id,
				req.params.id as string,
			)
			return res.status(200).json({
				success: true,
				data: address,
				message: "Đã đặt làm địa chỉ mặc định.",
			})
		} catch (error: any) {
			return res.status(400).json({ success: false, message: error.message })
		}
	}
}
