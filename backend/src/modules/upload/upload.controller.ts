import { Request, Response } from "express"
import cloudinary from "../../lib/cloudinary.js"

export const uploadImage = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "Vui lòng chọn tệp tin ảnh!" })
		}

		// Chuyển đổi buffer sang base64 để upload lên Cloudinary
		const b64 = Buffer.from(req.file.buffer).toString("base64")
		const dataURI = `data:${req.file.mimetype};base64,${b64}`

		const result = await cloudinary.uploader.upload(dataURI, {
			folder: "smart-market",
			format: "webp", // Tự động nén và chuyển đổi sang WebP
			transformation: [{ quality: "auto:good", fetch_format: "webp" }],
		})

		return res.status(200).json({ url: result.secure_url })
	} catch (error) {
		console.error("Lỗi upload ảnh:", error)
		return res.status(500).json({ message: "Lỗi máy chủ khi tải ảnh lên!" })
	}
}
