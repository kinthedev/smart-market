export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "MOMO";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

export interface CreateOrderPayload {
  receiverName: string;
  receiverPhone: string;
  address: string;
  note?: string | null;
  items: CreateOrderItemPayload[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  image?: string | null;
  price: number;
  size?: string | null;
  color?: string | null;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  userId: string;
  status: OrderStatus;
  total: number;
  receiverName: string;
  receiverPhone: string;
  address: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

/** Thông tin khách hàng đặt đơn (chỉ trả về ở API quản trị). */
export interface OrderCustomer {
  id: string;
  name: string | null;
  email: string;
}

/** Đơn hàng kèm thông tin khách hàng dành cho trang quản trị. */
export interface AdminOrder extends Order {
  user?: OrderCustomer | null;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  shipping: number;
  delivered: number;
  cancelled: number;
}

export interface AdminOrderResult {
  items: AdminOrder[];
  stats: OrderStats;
  pagination: OrderPagination;
}

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}
