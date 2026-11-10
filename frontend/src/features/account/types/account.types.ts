export interface UserProfile {
  avatarUrl: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "Nam" | "Nữ" | "Khác"
}

/** Dữ liệu nhập của một địa chỉ / thông tin người nhận. */
export interface AddressFormValue {
  receiverName: string
  receiverPhone: string
  provinceId: string
  districtId: string
  ward: string
  addressDetail: string
}

/** Thông tin người nhận đã lưu trong cơ sở dữ liệu. */
export interface ReceiverAddress extends AddressFormValue {
  id: string
  userId: string
  province: string
  district: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountSecurity {
  username: string
  passwordChangedAt?: string
}

export interface AccountData {
  profile: UserProfile
  security: AccountSecurity
}
