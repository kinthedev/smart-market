import { z } from "zod"

const phoneRegex = /^(0|\+84)[0-9]{9,10}$/

export const CreateShippingAddressSchema = z.object({
	receiverName: z
		.string()
		.trim()
		.min(2, "Họ tên người nhận tối thiểu 2 ký tự")
		.max(80, "Họ tên người nhận tối đa 80 ký tự"),
	receiverPhone: z
		.string()
		.trim()
		.regex(phoneRegex, "Số điện thoại người nhận không hợp lệ"),
	provinceId: z.string().trim().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
	districtId: z.string().trim().min(1, "Vui lòng chọn Quận/Huyện"),
	province: z.string().trim().min(1, "Tỉnh/Thành phố không hợp lệ"),
	district: z.string().trim().min(1, "Quận/Huyện không hợp lệ"),
	ward: z.string().trim().min(1, "Vui lòng chọn Phường/Xã"),
	addressDetail: z
		.string()
		.trim()
		.min(5, "Địa chỉ cụ thể tối thiểu 5 ký tự")
		.max(255, "Địa chỉ cụ thể tối đa 255 ký tự"),
	isDefault: z.boolean().optional(),
})

export const UpdateShippingAddressSchema = CreateShippingAddressSchema.partial()
