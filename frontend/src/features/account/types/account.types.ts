export interface UserProfile {
  avatarUrl: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "Nam" | "Nữ" | "Khác"
}

export interface UserAddress {
  provinceId: string
  districtId: string
  ward: string
  specificAddress: string
}

export interface AccountSecurity {
  username: string
  passwordChangedAt?: string
}

export interface AccountData {
  profile: UserProfile
  address: UserAddress
  security: AccountSecurity
}
