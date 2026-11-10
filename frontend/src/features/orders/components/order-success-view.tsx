"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Copy, ArrowRight, ShoppingBag, ShieldCheck, Truck, Home } from "lucide-react"
import type { Order, PaymentMethod } from "../types/order.types"
import { formatPrice } from "@/src/data-seed/shop-data"

interface OrderSuccessViewProps {
  order: Order
  paymentMethod: PaymentMethod
}

export function OrderSuccessView({ order, paymentMethod }: OrderSuccessViewProps) {
  const [copied, setCopied] = React.useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(order.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-3xl py-8 px-4">
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        {/* Header thành công */}
        <div className="text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Đặt hàng thành công!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Cảm ơn bạn đã tin tưởng mua sắm tại SmartMarket. Đơn hàng của bạn đang được xử lý.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs">
            <span className="text-slate-500">Mã đơn hàng:</span>
            <strong className="font-mono text-sm font-bold text-slate-800">
              {order.code}
            </strong>
            <button
              type="button"
              onClick={copyCode}
              className="ml-1 text-[#5b5bd6] hover:text-[#4a4ab8]"
              title="Sao chép mã đơn hàng"
            >
              {copied ? (
                <span className="text-[11px] font-semibold text-emerald-600">Đã chép!</span>
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Hướng dẫn chuyển khoản nếu chọn phương thức chuyển khoản */}
        {paymentMethod === "BANK_TRANSFER" && (
          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold text-blue-800">
              <ShieldCheck size={16} /> Thông tin thanh toán chuyển khoản ngân hàng:
            </div>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <p>Ngân hàng: <strong>MBBank (Ngân hàng Quân Đội)</strong></p>
                <p className="mt-1">Số tài khoản: <strong>0988889999</strong></p>
                <p className="mt-1">Chủ tài khoản: <strong>CONG TY SMARTMARKET VN</strong></p>
              </div>
              <div>
                <p>Số tiền: <strong className="text-rose-600 text-sm">{formatPrice(order.total)}đ</strong></p>
                <p className="mt-1">
                  Nội dung chuyển khoản: <strong className="text-[#5b5bd6] font-mono">{order.code}</strong>
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  (Hệ thống sẽ tự động xác nhận đơn hàng sau khi nhận được tiền)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Thông tin giao hàng */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Thông tin nhận hàng
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-4 text-xs sm:grid-cols-2">
            <div>
              <p className="text-slate-500">Người nhận:</p>
              <strong className="text-slate-800 text-sm">{order.receiverName}</strong>
              <p className="mt-1 text-slate-600">{order.receiverPhone}</p>
            </div>
            <div>
              <p className="text-slate-500">Địa chỉ giao hàng:</p>
              <p className="text-slate-800 font-medium">{order.address}</p>
              {order.note && (
                <p className="mt-1 text-slate-500 italic">Ghi chú: {order.note}</p>
              )}
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm trong đơn */}
        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sản phẩm đã đặt ({order.items.length})
          </h3>
          <div className="mt-3 divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 text-xs">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-slate-300">
                      <ShoppingBag size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
                  {(item.size || item.color) && (
                    <p className="text-slate-400 text-[11px]">
                      Phân loại: {[item.size, item.color].filter(Boolean).join(" / ")}
                    </p>
                  )}
                  <p className="text-slate-500 mt-0.5">
                    Số lượng: <strong className="text-slate-700">{item.quantity}</strong> × {formatPrice(item.price)}đ
                  </p>
                </div>
                <div className="text-right">
                  <strong className="text-sm font-bold text-slate-800">
                    {formatPrice(item.price * item.quantity)}đ
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Phương thức thanh toán:</span>
              <strong className="text-slate-800">
                {paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : paymentMethod === "BANK_TRANSFER"
                  ? "Chuyển khoản ngân hàng"
                  : "Ví điện tử MoMo"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600">Miễn phí</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
              <span className="font-bold text-slate-800">Tổng thanh toán:</span>
              <strong className="text-base font-extrabold text-[#ee4d2d]">
                {formatPrice(order.total)}đ
              </strong>
            </div>
          </div>
        </div>

        {/* Nút điều hướng */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#d43f21]"
          >
            <Home size={15} /> Về trang chủ mua sắm
          </Link>
          <Link
            href="/cart"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ShoppingBag size={15} /> Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  )
}
