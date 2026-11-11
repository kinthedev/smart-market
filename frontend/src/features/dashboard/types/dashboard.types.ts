export type DashboardRange = "today" | "7d" | "30d" | "month" | "year"

export interface DashboardStats {
  revenue: number
  orders: number
  productsSold: number
  customers: number
  pendingOrders: number
  lowStock: number
  totalProducts: number
}

export interface DashboardRevenuePoint {
  label: string
  revenue: number
  orders: number
}

export interface DashboardStatusCount {
  status: string
  label: string
  count: number
}

export interface DashboardTopProduct {
  productId: string
  name: string
  sold: number
  revenue: number
}

export interface DashboardRecentOrder {
  id: string
  code: string
  receiverName: string
  total: number
  status: string
  createdAt: string
}

export interface DashboardOverview {
  range: DashboardRange
  stats: DashboardStats
  revenueSeries: DashboardRevenuePoint[]
  ordersByStatus: DashboardStatusCount[]
  topProducts: DashboardTopProduct[]
  recentOrders: DashboardRecentOrder[]
}
