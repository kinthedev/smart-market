import { Request, Response } from "express"
import cloudinary from "../../lib/cloudinary.js"

export const uploadImage = async (req: Request, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "Vui lòng chọn tệp tin ảnh!" })
		}

		// Upload bằng stream trực tiếp từ buffer để tối ưu bộ nhớ và tốc độ
		const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: "smart-market",
					format: "webp", // Tự động nén và chuyển đổi sang WebP
					transformation: [{ quality: "auto:good", fetch_format: "webp" }],
				},
				(error, uploadResult) => {
					if (error || !uploadResult) {
						return reject(error || new Error("Cloudinary upload failed"))
					}
					resolve(uploadResult)
				}
			)
			stream.end(req.file!.buffer)
		})

		return res.status(200).json({ url: result.secure_url })
	} catch (error: any) {
		console.error("Lỗi upload ảnh:", error?.message || error)
		return res.status(500).json({ 
			message: error?.message || "Lỗi máy chủ khi tải ảnh lên!" 
		})
	}
}
