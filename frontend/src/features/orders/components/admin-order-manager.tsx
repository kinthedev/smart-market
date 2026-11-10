"use client"

import * as React from "react"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Inbox,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  ShoppingCart,
  StickyNote,
  Truck,
  User as UserIcon,
  X,
} from "lucide-react"
import { OrderApiService } from "../api/order.service"
import type {
  AdminOrder,
  OrderStats,
  OrderStatus,
} from "../types/order.types"

const STATUS_META: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  SHIPPING: {
    label: "Đang giao hàng",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  DELIVERED: {
    label: "Đã giao",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = (
  Object.keys(STATUS_META) as OrderStatus[]
).map((value) => ({ value, label: STATUS_META[value].label }))

const STATS_INITIAL: OrderStats = {
  total: 0,
  pending: 0,
  confirmed: 0,
  shipping: 0,
  delivered: 0,
  cancelled: 0,
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0)
}

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return value
  }
}

function countItems(order: AdminOrder) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

interface AdminOrderManagerProps {
  onNotice?: (msg: string) => void
}

export function AdminOrderManager({ onNotice }: AdminOrderManagerProps) {
  const [orders, setOrders] = React.useState<AdminOrder[]>([])
  const [stats, setStats] = React.useState<OrderStats>(STATS_INITIAL)
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | OrderStatus>(
    "ALL"
  )
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [selectedOrder, setSelectedOrder] = React.useState<AdminOrder | null>(
    null
  )
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  // Debounce ô tìm kiếm để tránh gọi API liên tục
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadOrders = React.useCallback(async () => {
    setLoading(true)
    try {
      const result = await OrderApiService.getAllOrders({
        page,
        limit: 10,
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: debouncedSearch.trim() || undefined,
      })

      setOrders(result.items || [])
      setStats(result.stats || STATS_INITIAL)
      setTotalCount(result.pagination?.total || 0)
      setTotalPages(result.pagination?.totalPages || 1)
    } catch (error: any) {
      onNotice?.(error?.message || "Không thể tải danh sách đơn hàng.")
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, debouncedSearch, onNotice])

  React.useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusChange = async (order: AdminOrder, nextStatus: OrderStatus) => {
    if (nextStatus === order.status) return

    if (nextStatus === "CANCELLED") {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn hủy đơn hàng ${order.code}?\nThao tác này không thể hoàn tác.`
      )
      if (!confirmed) return
    }

    const previousStatus = order.status
    setUpdatingId(order.id)

    try {
      const updated = await OrderApiService.updateOrderStatus(order.id, nextStatus)

      setOrders((prev) =>
        prev.map((item) =>
          item.id === order.id ? { ...item, ...updated } : item
        )
      )

      // Nếu đang lọc theo một trạng thái khác, đơn vừa đổi sẽ không còn thuộc bộ lọc
      if (statusFilter !== "ALL" && statusFilter !== nextStatus) {
        setOrders((prev) => prev.filter((item) => item.id !== order.id))
        setTotalCount((prev) => Math.max(0, prev - 1))
      }
      setSelectedOrder((prev) =>
        prev && prev.id === order.id ? { ...prev, ...updated } : prev
      )

      const statsKey: Record<OrderStatus, keyof OrderStats> = {
        PENDING: "pending",
        CONFIRMED: "confirmed",
        SHIPPING: "shipping",
        DELIVERED: "delivered",
        CANCELLED: "cancelled",
      }

      setStats((prev) => {
        const next = { ...prev }
        next[statsKey[previousStatus]] = Math.max(
          0,
          next[statsKey[previousStatus]] - 1
        )
        next[statsKey[nextStatus]] += 1
        return next
      })

      onNotice?.(
        `Đã cập nhật đơn ${order.code} sang "${STATUS_META[nextStatus].label}".`
      )
    } catch (error: any) {
      onNotice?.(error?.message || "Không thể cập nhật trạng thái đơn hàng.")
    } finally {
      setUpdatingId(null)
    }
  }

  const pageNumbers = React.useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
    )
  }, [page, totalPages])

  return (
    <>
      {/* 1. Tiêu đề trang */}
      <div className="tieu-de-trang">
        <div>
          <p className="loi-chao">Quản lý bán hàng</p>
          <h1>Đơn hàng</h1>
          <p className="mo-ta">
            Theo dõi và xử lý tất cả đơn hàng do khách hàng đặt trên cửa hàng.
          </p>
        </div>
      </div>

      {/* 2. Thẻ thống kê theo trạng thái */}
      <div className="luoi-the-nho">
        <div>
          <ShoppingCart size={17} className="text-[#5b5bd6]" />
          <span>Tổng đơn hàng</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <Clock size={17} className="text-amber-500" />
          <span>Chờ xác nhận</span>
          <strong>{stats.pending}</strong>
        </div>
        <div>
          <Truck size={17} className="text-indigo-500" />
          <span>Đang giao hàng</span>
          <strong>{stats.shipping}</strong>
        </div>
        <div>
          <CheckCircle2 size={17} className="text-emerald-600" />
          <span>Đã giao</span>
          <strong>{stats.delivered}</strong>
        </div>
      </div>

      {/* 3. Thanh công cụ tìm kiếm & lọc */}
      <div className="thanh-cong-cu flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="o-tim-kiem min-w-[240px] flex-1 sm:max-w-xs">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã đơn, tên, SĐT, email..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "ALL" | OrderStatus)
              setPage(1)
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="nut-loc"
          onClick={loadOrders}
          disabled={loading}
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* 4. Bảng danh sách đơn hàng */}
      <section className="the-noi-dung bang-du-lieu">
        <div className="tieu-de-bang">
          <div>
            <h2>
              Tất cả đơn hàng <span>{totalCount}</span>
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Trang {page} / {totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <RefreshCw className="size-7 animate-spin text-[#5b5bd6]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="trang-rong flex flex-col items-center justify-center py-14 text-center">
            <Inbox size={44} strokeWidth={1.5} className="mb-2 text-slate-400" />
            <strong className="text-[15px] text-slate-700">
              Chưa có đơn hàng nào
            </strong>
            <p className="mt-1 text-[13px] text-slate-500">
              {debouncedSearch || statusFilter !== "ALL"
                ? "Không có đơn hàng phù hợp với bộ lọc hiện tại. Hãy thử từ khóa khác."
                : "Đơn hàng mới từ khách hàng sẽ xuất hiện tại đây."}
            </p>
          </div>
        ) : (
          <>
            {/* Bảng cho máy tính */}
            <div className="bang-cuon hidden md:block">
              <table>
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Khách hàng</th>
                    <th>Ngày đặt</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Cập nhật</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const meta = STATUS_META[order.status] ?? STATUS_META.PENDING

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/60">
                        <td>
                          <strong className="font-mono text-slate-800">
                            {order.code}
                          </strong>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#5b5bd6]/10 text-xs font-bold text-[#5b5bd6]">
                              {order.user?.name?.slice(0, 1)?.toUpperCase() || "K"}
                            </div>
                            <div className="min-w-0">
                              <strong className="block max-w-[170px] truncate text-slate-800">
                                {order.user?.name || order.receiverName}
                              </strong>
                              <span className="block max-w-[170px] truncate text-[10px] text-slate-400">
                                {order.user?.email || order.receiverPhone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-slate-500">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </td>
                        <td>{countItems(order)}</td>
                        <td>
                          <strong className="text-[#ee4d2d]">
                            {formatCurrency(order.total)}
                          </strong>
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.className}`}
                          >
                            <span className={`size-1.5 rounded-full ${meta.dot}`} />
                            {meta.label}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleStatusChange(
                                order,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Cập nhật trạng thái đơn hàng"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="nut-loc"
                            style={{ height: "29px", padding: "0 9px", gap: "4px" }}
                            title="Xem chi tiết đơn hàng"
                          >
                            <Eye size={13} /> Xem
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Thẻ cho điện thoại */}
            <div className="divide-y divide-slate-100 md:hidden">
              {orders.map((order) => {
                const meta = STATUS_META[order.status] ?? STATUS_META.PENDING

                return (
                  <div key={order.id} className="space-y-2.5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <strong className="block font-mono text-sm text-slate-800">
                          {order.code}
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(order.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.className}`}
                      >
                        <span className={`size-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="truncate">
                        {order.user?.name || order.receiverName}
                      </span>
                      <strong className="text-[#ee4d2d]">
                        {formatCurrency(order.total)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value as OrderStatus)
                        }
                        className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="nut-loc text-xs"
                        style={{ height: "32px", padding: "0 10px" }}
                      >
                        <Eye size={13} /> Xem
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Phân trang */}
            <div className="phan-trang">
              <span>
                Hiển thị <strong>{orders.length}</strong> trên{" "}
                <strong>{totalCount}</strong> đơn hàng
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  title="Trang trước"
                  className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>

                {pageNumbers.map((p, index) => {
                  const previous = pageNumbers[index - 1]
                  const needEllipsis = previous && p - previous > 1

                  return (
                    <React.Fragment key={p}>
                      {needEllipsis && <span className="px-1">...</span>}
                      <button
                        type="button"
                        onClick={() => setPage(p)}
                        className={`size-8 rounded-md text-[11px] font-semibold ${
                          page === p
                            ? "border border-[#5b5bd6] bg-[#5b5bd6] text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  )
                })}

                <button
                  type="button"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  title="Trang sau"
                  className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 5. Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isUpdating={updatingId === selectedOrder.id}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) => handleStatusChange(selectedOrder, status)}
        />
      )}
    </>
  )
}

function OrderDetailModal({
  order,
  isUpdating,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder
  isUpdating: boolean
  onClose: () => void
  onStatusChange: (status: OrderStatus) => void
}) {
  const meta = STATUS_META[order.status] ?? STATUS_META.PENDING

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-base font-bold text-slate-800">
                {order.code}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.className}`}
              >
                <span className={`size-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Đặt lúc {formatDateTime(order.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm text-slate-700">
          {/* Khách hàng & giao hàng */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <UserIcon size={13} className="text-[#5b5bd6]" /> Khách hàng
              </span>
              <strong className="mt-1 block text-sm text-slate-800">
                {order.user?.name || order.receiverName}
              </strong>
              <span className="block text-[11px] text-slate-500">
                {order.user?.email || "Chưa có email"}
              </span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Phone size={13} className="text-emerald-600" /> Người nhận
              </span>
              <strong className="mt-1 block text-sm text-slate-800">
                {order.receiverName}
              </strong>
              <span className="block text-[11px] text-slate-500">
                {order.receiverPhone}
              </span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:col-span-2">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <MapPin size={13} className="text-rose-500" /> Địa chỉ giao hàng
              </span>
              <p className="mt-1 text-sm text-slate-700">{order.address}</p>
              {order.note && (
                <p className="mt-1 flex items-start gap-1.5 text-[11px] text-slate-500">
                  <StickyNote size={12} className="mt-0.5 shrink-0" />
                  Ghi chú: {order.note}
                </p>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Package size={14} /> Sản phẩm trong đơn
            </h3>
            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 p-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ShoppingBag size={18} className="text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-slate-800">
                      {item.name}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {[item.size, item.color].filter(Boolean).join(" / ") ||
                        "Phân loại mặc định"}{" "}
                      · SL: {item.quantity}
                    </span>
                  </div>
                  <strong className="shrink-0 text-sm text-slate-800">
                    {formatCurrency(item.price * item.quantity)}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          {/* Tổng tiền */}
          <div className="flex items-center justify-between rounded-lg bg-[#ee4d2d]/5 px-4 py-3">
            <span className="text-xs font-medium text-slate-600">
              Tổng thanh toán
            </span>
            <strong className="text-base font-extrabold text-[#ee4d2d]">
              {formatCurrency(order.total)}
            </strong>
          </div>

          {/* Cập nhật trạng thái */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Cập nhật trạng thái đơn hàng
            </label>
            <select
              value={order.status}
              disabled={isUpdating}
              onChange={(e) => onStatusChange(e.target.value as OrderStatus)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
