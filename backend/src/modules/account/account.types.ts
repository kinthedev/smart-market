export interface ShippingAddressInput {
	receiverName: string
	receiverPhone: string
	provinceId: string
	districtId: string
	province: string
	district: string
	ward: string
	addressDetail: string
	isDefault?: boolean
}
