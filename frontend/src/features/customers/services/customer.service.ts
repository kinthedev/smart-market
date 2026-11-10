import { env } from "@/src/lib/env"
import type { Customer } from "../types/customer.types"

const BACKEND_URL = env.BACKEND_URL

export class CustomerService {
  static async fetchCustomers(params?: { search?: string; status?: string }): Promise<Customer[]> {
    const query = new URLSearchParams()
    if (params?.search) query.set("search", params.search)
    if (params?.status) query.set("status", params.status)

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/customers?${query.toString()}`, {
        cache: "no-store",
        credentials: "include",
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        return data.data
      }
      return []
    } catch {
      return []
    }
  }

  static async addCustomer(customerData: any): Promise<Customer> {
    const res = await fetch(`${BACKEND_URL}/api/v1/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
      credentials: "include",
    })
    const result = await res.json()
    if (!result.success) {
      throw new Error(result.message || "Không thể tạo khách hàng trong cơ sở dữ liệu.")
    }
    return result.data
  }

  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`${BACKEND_URL}/api/v1/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    })
    const result = await res.json()
    if (!result.success) {
      throw new Error(result.message || "Không thể cập nhật khách hàng.")
    }
    return result.data
  }

  static async deleteCustomer(id: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/v1/customers/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    const result = await res.json()
    if (!result.success) {
      throw new Error(result.message || "Không thể xóa khách hàng khỏi cơ sở dữ liệu.")
    }
  }

  static async toggleStatus(id: string): Promise<Customer> {
    const res = await fetch(`${BACKEND_URL}/api/v1/customers/${id}/toggle-status`, {
      method: "PATCH",
      credentials: "include",
    })
    const result = await res.json()
    if (!result.success) {
      throw new Error(result.message || "Không thể đổi trạng thái tài khoản.")
    }
    return result.data
  }
}
