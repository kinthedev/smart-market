export interface CustomerOrderHistory {
  id: string
  orderCode: string
  date: string
  totalAmount: number
  paymentMethod: string
  status: "Hoàn thành" | "Đang giao" | "Đã hủy" | "Chờ xác nhận"
  itemCount: number
}

export interface Customer {
  id: string
  code: string // Mã KH, ví dụ: KH-1001
  name: string
  email: string
  phone: string
  avatar?: string
  registeredAt: string
  status: "Hoạt động" | "Bị khóa"
  totalOrders: number
  totalSpent: number
  province?: string
  district?: string
  ward?: string
  addressDetail?: string
  gender?: "Nam" | "Nữ" | "Khác"
  dateOfBirth?: string
  notes?: string
  orderHistory?: CustomerOrderHistory[]
}

export interface CustomerStats {
  total: number
  newCustomers: number
  purchased: number
  noPurchases: number
}
