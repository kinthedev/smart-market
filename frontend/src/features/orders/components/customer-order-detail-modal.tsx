"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CalendarClock,
  Loader2,
  MapPin,
  Package,
  Phone,
  ReceiptText,
  StickyNote,
  User as UserIcon,
  X,
} from "lucide-react"
import { formatPrice } from "@/src/data-seed/shop-data"
import type { Order } from "../types/order.types"
import {
  formatOrderDateTime,
  ORDER_STATUS_META,
} from "../utils/order-status"

type CustomerOrderDetailModalProps = {
  order: Order
  isCancelling?: boolean
  onClose: () => void
  onCancel?: (order: Order) => void
}

export function CustomerOrderDetailModal({
  order,
  isCancelling = false,
  onClose,
  onCancel,
}: CustomerOrderDetailModalProps) {
  const meta = ORDER_STATUS_META[order.status] ?? ORDER_STATUS_META.CONFIRMED
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED"

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-detail-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-lg bg-white shadow-xl sm:rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <ReceiptText className="size-4 text-primary" aria-hidden="true" />
              <h2
                id="order-detail-title"
                className="font-mono text-base font-bold text-slate-800"
              >
                {order.code}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${meta.className}`}
              >
                <span className={`size-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
              <CalendarClock className="size-3" />
              Đặt lúc {formatOrderDateTime(order.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết đơn hàng"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {/* Người nhận */}
          <section className="rounded-sm bg-slate-50 p-3 text-sm">
            <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <UserIcon className="size-3.5" /> Thông tin người nhận
            </h3>
            <p className="font-semibold text-slate-800">{order.receiverName}</p>
            <p className="mt-1 flex items-center gap-1.5 text-slate-600">
              <Phone className="size-3.5 text-slate-400" />
              {order.receiverPhone}
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-slate-600">
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              <span>{order.address}</span>
            </p>
            {order.note ? (
              <p className="mt-1 flex items-start gap-1.5 text-slate-600">
                <StickyNote className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                <span>Ghi chú: {order.note}</span>
              </p>
            ) : null}
          </section>

          {/* Sản phẩm */}
          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Package className="size-3.5" /> Sản phẩm ({totalQuantity})
            </h3>
            <ul className="divide-y divide-slate-100 rounded-sm border border-slate-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 p-3">
                  <Link
                    href={`/product/${item.productId}`}
                    onClick={onClose}
                    className="relative size-16 shrink-0 overflow-hidden rounded-sm border border-slate-100 bg-slate-50 sm:size-20"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        loading="lazy"
                        decoding="async"
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-neutral-400">
                        <Package className="size-5" />
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={onClose}
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
                        {formatPrice(item.price)}đ × {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(item.price * item.quantity)}đ
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-500">
              Tổng thanh toán ({totalQuantity} sản phẩm)
            </span>
            <strong className="text-lg font-extrabold text-[#ee4d2d]">
              {formatPrice(order.total)}đ
            </strong>
          </div>

          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {canCancel && onCancel ? (
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => onCancel(order)}
                className="inline-flex items-center gap-1.5 rounded-sm border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="size-3 animate-spin" />}
                Hủy đơn hàng
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-sm bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
