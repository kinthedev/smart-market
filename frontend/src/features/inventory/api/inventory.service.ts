import { env } from "@/src/lib/env";
import type {
  InventoryQuery,
  InventoryResult,
  InventoryVariant,
} from "../types/inventory.types";

const BACKEND_URL = env.BACKEND_URL;

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Có lỗi xảy ra khi xử lý tồn kho.");
  }
  return data.data as T;
}

export class InventoryApiService {
  /** Lấy danh sách tồn kho theo biến thể (chỉ quản trị viên) */
  static async getInventory(params: InventoryQuery = {}): Promise<InventoryResult> {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.search?.trim()) query.set("search", params.search.trim());
    if (params.stockStatus) query.set("stockStatus", params.stockStatus);

    const suffix = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${BACKEND_URL}/api/v1/inventory${suffix}`, {
      cache: "no-store",
      credentials: "include",
    });
    return parseResponse<InventoryResult>(res);
  }

  /** Cập nhật số lượng tồn kho của một biến thể (chỉ quản trị viên) */
  static async updateStock(
    variantId: string,
    stock: number
  ): Promise<InventoryVariant> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/inventory/variants/${encodeURIComponent(variantId)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
        credentials: "include",
      }
    );
    return parseResponse<InventoryVariant>(res);
  }
}
