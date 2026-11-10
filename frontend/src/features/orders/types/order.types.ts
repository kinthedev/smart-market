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
