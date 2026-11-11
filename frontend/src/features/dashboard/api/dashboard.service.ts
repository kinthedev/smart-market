import { env } from "@/src/lib/env"
import type { DashboardOverview, DashboardRange } from "../types/dashboard.types"

export class DashboardApiService {
  static async getOverview(range: DashboardRange): Promise<DashboardOverview> {
    const res = await fetch(
      `${env.BACKEND_URL}/api/v1/dashboard/overview?range=${encodeURIComponent(range)}`,
      { cache: "no-store", credentials: "include" }
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể tải dữ liệu tổng quan.")
    }
    return data.data as DashboardOverview
  }
}
