import { env } from "@/src/lib/env";
import type {
  AdminOrderQuery,
  AdminOrderResult,
  CreateOrderPayload,
  Order,
  OrderStatus,
} from "../types/order.types";

const BACKEND_URL = env.BACKEND_URL;

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Có lỗi xảy ra khi xử lý đơn hàng.");
  }
  return data.data as T;
}

export class OrderApiService {
  /**
   * Tạo đơn hàng mới
   */
  static async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return parseResponse<Order>(res);
  }

  /**
   * Lấy danh sách đơn hàng của người dùng hiện tại
   */
  static async getMyOrders(): Promise<Order[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/orders/my`, {
      cache: "no-store",
      credentials: "include",
    });
    return parseResponse<Order[]>(res);
  }

  /**
   * Lấy chi tiết một đơn hàng theo ID
   */
  static async getOrderById(id: string): Promise<Order> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/orders/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        credentials: "include",
      }
    );
    return parseResponse<Order>(res);
  }

  /**
   * Lấy toàn bộ đơn hàng của cửa hàng (chỉ dành cho quản trị viên)
   */
  static async getAllOrders(
    params: AdminOrderQuery = {}
  ): Promise<AdminOrderResult> {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.status) query.set("status", params.status);
    if (params.search?.trim()) query.set("search", params.search.trim());

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${BACKEND_URL}/api/v1/orders${suffix}`, {
      cache: "no-store",
      credentials: "include",
    });
    return parseResponse<AdminOrderResult>(res);
  }

  /**
   * Cập nhật trạng thái đơn hàng (chỉ dành cho quản trị viên)
   */
  static async updateOrderStatus(
    id: string,
    status: OrderStatus
  ): Promise<Order> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/orders/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      }
    );
    return parseResponse<Order>(res);
  }
}
