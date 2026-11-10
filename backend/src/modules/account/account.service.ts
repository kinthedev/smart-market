import { prisma } from "../../lib/prisma.js"
import type { ShippingAddressInput } from "./account.types.js"

/**
 * Nghiệp vụ sổ địa chỉ người nhận của khách hàng.
 * Mỗi khách hàng có thể lưu nhiều địa chỉ, luôn đảm bảo tối đa 1 địa chỉ mặc định.
 */
export class AccountService {
	static async getAddresses(userId: string) {
		return prisma.shippingAddress.findMany({
			where: { userId },
			orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
		})
	}

	static async getDefaultAddress(userId: string) {
		return prisma.shippingAddress.findFirst({
			where: { userId, isDefault: true },
			orderBy: { createdAt: "desc" },
		})
	}

	static async createAddress(userId: string, input: ShippingAddressInput) {
		const total = await prisma.shippingAddress.count({ where: { userId } })
		// Địa chỉ đầu tiên luôn được chọn làm mặc định.
		const shouldBeDefault = Boolean(input.isDefault) || total === 0

		return prisma.$transaction(async (tx) => {
			if (shouldBeDefault) {
				await tx.shippingAddress.updateMany({
					where: { userId, isDefault: true },
					data: { isDefault: false },
				})
			}

			return tx.shippingAddress.create({
				data: {
					userId,
					receiverName: input.receiverName,
					receiverPhone: input.receiverPhone,
					provinceId: input.provinceId,
					districtId: input.districtId,
					province: input.province,
					district: input.district,
					ward: input.ward,
					addressDetail: input.addressDetail,
					isDefault: shouldBeDefault,
				},
			})
		})
	}

	static async updateAddress(
		userId: string,
		id: string,
		input: Partial<ShippingAddressInput>,
	) {
		const existing = await prisma.shippingAddress.findFirst({
			where: { id, userId },
		})

		if (!existing) {
			throw new Error("Không tìm thấy thông tin người nhận cần cập nhật.")
		}

		const makeDefault = input.isDefault === true

		return prisma.$transaction(async (tx) => {
			if (makeDefault) {
				await tx.shippingAddress.updateMany({
					where: { userId, isDefault: true, id: { not: id } },
					data: { isDefault: false },
				})
			}

			return tx.shippingAddress.update({
				where: { id },
				data: {
					...(input.receiverName !== undefined
						? { receiverName: input.receiverName }
						: {}),
					...(input.receiverPhone !== undefined
						? { receiverPhone: input.receiverPhone }
						: {}),
					...(input.provinceId !== undefined
						? { provinceId: input.provinceId }
						: {}),
					...(input.districtId !== undefined
						? { districtId: input.districtId }
						: {}),
					...(input.province !== undefined ? { province: input.province } : {}),
					...(input.district !== undefined ? { district: input.district } : {}),
					...(input.ward !== undefined ? { ward: input.ward } : {}),
					...(input.addressDetail !== undefined
						? { addressDetail: input.addressDetail }
						: {}),
					...(makeDefault ? { isDefault: true } : {}),
				},
			})
		})
	}

	static async deleteAddress(userId: string, id: string) {
		const existing = await prisma.shippingAddress.findFirst({
			where: { id, userId },
		})

		if (!existing) {
			throw new Error("Không tìm thấy thông tin người nhận cần xóa.")
		}

		return prisma.$transaction(async (tx) => {
			await tx.shippingAddress.delete({ where: { id } })

			// Nếu vừa xóa địa chỉ mặc định, chọn địa chỉ mới nhất còn lại làm mặc định.
			if (existing.isDefault) {
				const next = await tx.shippingAddress.findFirst({
					where: { userId },
					orderBy: { createdAt: "desc" },
				})

				if (next) {
					await tx.shippingAddress.update({
						where: { id: next.id },
						data: { isDefault: true },
					})
				}
			}

			return { id }
		})
	}

	static async setDefaultAddress(userId: string, id: string) {
		const existing = await prisma.shippingAddress.findFirst({
			where: { id, userId },
		})

		if (!existing) {
			throw new Error("Không tìm thấy thông tin người nhận.")
		}

		return prisma.$transaction(async (tx) => {
			await tx.shippingAddress.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false },
			})

			return tx.shippingAddress.update({
				where: { id },
				data: { isDefault: true },
			})
		})
	}
}
