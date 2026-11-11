"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarClock,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  ReceiptText,
  ShoppingBag,
} from "lucide-react"
import { SiteHeader } from "@/src/components/site-header"
import { SiteFooter } from "@/src/components/site-footer"
import { useAuth } from "@/src/features/auth/hooks/use-auth"
import { OrderApiService } from "../api/order.service"
import type { Order, OrderStatus } from "../types/order.types"
import { formatPrice } from "@/src/data-seed/shop-data"
import type { User } from "@/src/data-seed/shop-data"
import { CustomerOrderDetailModal } from "./customer-order-detail-modal"
import {
  formatOrderDateTime,
  ORDER_STATUS_FILTERS as FILTERS,
  ORDER_STATUS_META as STATUS_META,
} from "../utils/order-status"

export function MyOrdersView() {
  const { user: authUser, logout, isLoading: isAuthLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrderStatus>("ALL")
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)

  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    }
  }, [authUser])

  useEffect(() => {
    if (isAuthLoading) return

    if (!authUser) {
      setOrders([])
      setIsLoading(false)
      return
    }

    let mounted = true
    setIsLoading(true)
    setErrorMessage("")

    OrderApiService.getMyOrders()
      .then((data) => {
        if (mounted) setOrders(Array.isArray(data) ? data : [])
      })
      .catch((error: any) => {
        if (mounted) {
          setErrorMessage(error?.message || "Không thể tải danh sách đơn hàng.")
          setOrders([])
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [authUser, isAuthLoading])

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return

    setCancellingId(orderId)
    setCancelError(null)

    try {
      const updated = await OrderApiService.cancelOrder(orderId)
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      )
      setDetailOrder((current) =>
        current && current.id === orderId ? { ...current, ...updated } : current
      )
    } catch (error: any) {
      alert(error?.message || "Không thể hủy đơn hàng.")
    } finally {
      setCancellingId(null)
    }
  }

  const filteredOrders = useMemo(() => {
    if (activeFilter === "ALL") return orders
    return orders.filter((order) => order.status === activeFilter)
  }, [orders, activeFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length }
    for (const order of orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1
    }
    return counts
  }, [orders])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader user={currentUser} onLogout={() => logout()} />

      <main className="mx-auto max-w-5xl px-4 py-5">
        {/* Breadcrumb */}
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-slate-700">Đơn mua</span>
        </nav>

        <div className="mb-4 rounded-sm bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Lịch sử mua hàng
              </p>
              <h1 className="text-xl font-bold text-neutral-800">Đơn mua của tôi</h1>
            </div>
            <p className="text-sm text-neutral-500">{orders.length} đơn hàng</p>
          </div>

          {orders.length > 0 && (
            <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
              {FILTERS.map((filter) => {
                const active = activeFilter === filter.value
                const count = statusCounts[filter.value] ?? 0
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {filter.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {isAuthLoading || isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-sm bg-white py-16 text-sm text-neutral-600 shadow-sm">
            <Loader2 className="size-5 animate-spin" />
            Đang tải danh sách đơn hàng...
          </div>
        ) : !authUser ? (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white py-16 text-center shadow-sm">
            <Package className="size-12 text-neutral-300" />
            <p className="text-lg font-semibold text-neutral-800">
              Đăng nhập để xem đơn mua
            </p>
            <p className="text-sm text-neutral-500">
              Lịch sử đơn hàng được lưu theo tài khoản của bạn.
            </p>
            <Link
              href="/login?callbackUrl=/orders"
              className="mt-2 inline-flex rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : errorMessage ? (
          <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white py-16 text-center shadow-sm">
            <ReceiptText className="size-12 text-neutral-300" />
            <p className="text-lg font-semibold text-neutral-800">
              {orders.length === 0
                ? "Bạn chưa có đơn hàng nào"
                : "Không có đơn hàng ở trạng thái này"}
            </p>
            <p className="text-sm text-neutral-500">
              {orders.length === 0
                ? "Hãy khám phá sản phẩm và đặt đơn hàng đầu tiên của bạn."
                : "Thử chọn bộ lọc trạng thái khác để xem các đơn hàng khác."}
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex items-center gap-1.5 rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              <ShoppingBag className="size-4" />
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.CONFIRMED
              const totalQuantity = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              )

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-sm bg-white shadow-sm"
                >
                  {/* Header đơn hàng */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-mono text-sm font-bold text-slate-800">
                          {order.code}
                        </strong>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${meta.className}`}
                        >
                          <span className={`size-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <CalendarClock className="size-3" />
                        {formatOrderDateTime(order.createdAt)}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {totalQuantity} sản phẩm
                    </span>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <ul className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex gap-3 px-4 py-3">
                        <Link
                          href={`/product/${item.productId}`}
                          className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-slate-100 bg-slate-50 sm:size-20"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-neutral-400">
                              <ShoppingBag className="size-5" />
                            </span>
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/product/${item.productId}`}
                            className="line-clamp-2 text-sm font-medium text-neutral-800 hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="mt-0.5 text-[11px] text-neutral-500">
                              Phân loại:{" "}
                              {[item.size, item.color].filter(Boolean).join(" / ")}
                            </p>
                          )}
                          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-neutral-500">
                              SL: {item.quantity}
                            </span>
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(item.price * item.quantity)}đ
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Footer đơn hàng */}
                  <div className="space-y-2 bg-slate-50/70 px-4 py-3">
                    <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-600">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                      <span>
                        <strong className="font-semibold text-slate-700">
                          {order.receiverName}
                        </strong>{" "}
                        · {order.receiverPhone} · {order.address}
                      </span>
                    </p>
                    {order.note && (
                      <p className="text-[11px] text-slate-500">
                        Ghi chú: {order.note}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          Tổng thanh toán
                        </span>
                        <button
                          type="button"
                          onClick={() => setDetailOrder(order)}
                          className="inline-flex items-center gap-1 rounded-sm border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary"
                        >
                          <ReceiptText className="size-3" />
                          Xem chi tiết
                        </button>
                        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                          <button
                            type="button"
                            disabled={cancellingId === order.id}
                            onClick={() => handleCancelOrder(order.id)}
                            className="inline-flex items-center gap-1 rounded-sm border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                          >
                            {cancellingId === order.id && (
                              <Loader2 className="size-3 animate-spin" />
                            )}
                            Hủy đơn hàng
                          </button>
                        )}
                      </div>
                      <strong className="text-base font-extrabold text-[#ee4d2d]">
                        {formatPrice(order.total)}đ
                      </strong>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {detailOrder ? (
        <CustomerOrderDetailModal
          order={detailOrder}
          isCancelling={cancellingId === detailOrder.id}
          onClose={() => setDetailOrder(null)}
          onCancel={(order) => handleCancelOrder(order.id)}
        />
      ) : null}

      <SiteFooter />
    </div>
  )
}
