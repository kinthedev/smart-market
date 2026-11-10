import { env } from "@/src/lib/env";
import type { AddressFormValue, ReceiverAddress } from "../types/account.types";

const BACKEND_URL = env.BACKEND_URL;

export interface ShippingAddressPayload extends AddressFormValue {
  province: string;
  district: string;
  isDefault?: boolean;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
  }
  return data.data as T;
}

/**
 * API sổ địa chỉ người nhận — dữ liệu lưu thật trong PostgreSQL.
 */
export class AccountApiService {
  static async getAddresses(): Promise<ReceiverAddress[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/account/addresses`, {
      cache: "no-store",
      credentials: "include",
    });
    return parseResponse<ReceiverAddress[]>(res);
  }

  static async createAddress(
    payload: ShippingAddressPayload
  ): Promise<ReceiverAddress> {
    const res = await fetch(`${BACKEND_URL}/api/v1/account/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return parseResponse<ReceiverAddress>(res);
  }

  static async updateAddress(
    id: string,
    payload: ShippingAddressPayload
  ): Promise<ReceiverAddress> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/account/addresses/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    return parseResponse<ReceiverAddress>(res);
  }

  static async deleteAddress(id: string): Promise<{ id: string }> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/account/addresses/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    return parseResponse<{ id: string }>(res);
  }

  static async setDefaultAddress(id: string): Promise<ReceiverAddress> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/account/addresses/${encodeURIComponent(id)}/default`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    return parseResponse<ReceiverAddress>(res);
  }
}
