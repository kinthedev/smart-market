"use client"

import * as React from "react"
import { X, User, Phone, Mail, MapPin, Calendar, ShoppingCart, DollarSign, Package } from "lucide-react"
import type { Customer } from "../types/customer.types"

interface CustomerDetailModalProps {
  customer: Customer
  onClose: () => void
  onEdit: () => void
  onToggleStatus: () => void
}

export function CustomerDetailModal({
  customer,
  onClose,
  onEdit,
  onToggleStatus,
}: CustomerDetailModalProps) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#5b5bd6]/10 font-bold text-[#5b5bd6]">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="size-11 rounded-full object-cover"
                />
              ) : (
                customer.name.slice(0, 1).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-800">{customer.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    customer.status === "Hoạt động"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Mã KH: {customer.code}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm text-slate-700">
          {/* Thống kê mua hàng */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShoppingCart size={14} className="text-[#5b5bd6]" /> Tổng đơn hàng
              </span>
              <strong className="mt-1 block text-lg font-bold text-slate-800">
                {customer.totalOrders}
              </strong>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <DollarSign size={14} className="text-emerald-600" /> Tổng chi tiêu
              </span>
              <strong className="mt-1 block text-lg font-bold text-emerald-600">
                {formatCurrency(customer.totalSpent)}
              </strong>
            </div>
            <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:col-span-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={14} className="text-amber-500" /> Ngày đăng ký
              </span>
              <strong className="mt-1 block text-sm font-semibold text-slate-700">
                {customer.registeredAt}
              </strong>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="rounded-lg border border-slate-200/80 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Thông tin liên hệ & cá nhân
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[11px] text-slate-400">Email</span>
                  <span className="font-medium text-slate-800">{customer.email || "Chưa cập nhật"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[11px] text-slate-400">Số điện thoại</span>
                  <span className="font-medium text-slate-800">{customer.phone || "Chưa cập nhật"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <User size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[11px] text-slate-400">Giới tính</span>
                  <span className="font-medium text-slate-800">{customer.gender || "Chưa xác định"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <span className="block text-[11px] text-slate-400">Ngày sinh</span>
                  <span className="font-medium text-slate-800">{customer.dateOfBirth || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div className="rounded-lg border border-slate-200/80 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Địa chỉ nhận hàng mặc định
            </h4>
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[#5b5bd6]" />
              <div>
                <p className="font-medium text-slate-800">
                  {customer.addressDetail
                    ? `${customer.addressDetail}, ${customer.ward || ""}, ${customer.district || ""}, ${customer.province || ""}`
                    : "Khách hàng chưa cập nhật địa chỉ cụ thể."}
                </p>
              </div>
            </div>
          </div>

          {/* Lịch sử mua hàng */}
          <div className="rounded-lg border border-slate-200/80 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Lịch sử mua hàng ({customer.orderHistory?.length || 0} đơn)
            </h4>
            {!customer.orderHistory || customer.orderHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <Package size={28} className="mx-auto mb-1 text-slate-300" />
                Khách hàng chưa thực hiện đơn mua nào trên hệ thống.
              </div>
            ) : (
              <div className="space-y-2">
                {customer.orderHistory.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/50 p-2.5 text-xs"
                  >
                    <div>
                      <strong className="text-slate-800">{ord.orderCode}</strong>
                      <span className="ml-2 text-slate-400">{ord.date}</span>
                      <p className="text-[11px] text-slate-500">PT: {ord.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <strong className="block text-emerald-600">{formatCurrency(ord.totalAmount)}</strong>
                      <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onToggleStatus}
            className={`nut-loc text-xs ${
              customer.status === "Hoạt động" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {customer.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="nut-loc text-xs">
              Đóng
            </button>
            <button type="button" onClick={onEdit} className="nut-chinh text-xs">
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
