"use client"

import * as React from "react"
import {
  X,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  ExternalLink,
  Package,
} from "lucide-react"
import Link from "next/link"
import type { Review } from "../types/review.types"
import { StarRating } from "./star-rating"

interface ReviewDetailModalProps {
  review: Review
  onClose: () => void
  onToggleHide: (review: Review) => void
  onDelete: (review: Review) => void
  isUpdating?: boolean
}

export function ReviewDetailModal({
  review,
  onClose,
  onToggleHide,
  onDelete,
  isUpdating = false,
}: ReviewDetailModalProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  const userInitial =
    review.user?.name?.slice(0, 1)?.toUpperCase() || "U"
  const productImage = review.product?.images?.[0]?.url

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5b5bd6]/10 font-bold text-[#5b5bd6]">
              {review.user?.image ? (
                <img
                  src={review.user.image}
                  alt={review.user.name}
                  className="size-11 object-cover"
                />
              ) : (
                userInitial
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">
                  {review.user?.name || "Khách hàng ẩn danh"}
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    review.isHidden
                      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  }`}
                >
                  {review.isHidden ? "Đang bị ẩn" : "Đang hiển thị"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{review.user?.email || "Chưa có email"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm text-slate-700">
          {/* 3 Thẻ tóm tắt thông số */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Đánh giá sao */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                Số sao đánh giá
              </span>
              <div className="mt-1 flex items-center gap-2">
                <strong className="text-lg font-bold text-slate-800">
                  {review.rating} / 5
                </strong>
                <StarRating value={review.rating} size="sm" />
              </div>
            </div>

            {/* Trạng thái mua hàng */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                {review.verifiedPurchase ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={14} className="text-slate-400" />
                )}
                Xác thực đơn mua
              </span>
              <strong className="mt-1 block text-sm font-semibold text-emerald-700">
                {review.verifiedPurchase ? "Đã mua hàng thật" : "Chưa xác thực"}
              </strong>
            </div>

            {/* Ngày đánh giá */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar size={14} className="text-blue-500" />
                Thời gian đánh giá
              </span>
              <strong className="mt-1 block text-xs font-semibold text-slate-700">
                {formatDate(review.createdAt)}
              </strong>
            </div>
          </div>

          {/* Sản phẩm được đánh giá */}
          <div className="rounded-lg border border-slate-200/80 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Sản phẩm được đánh giá
            </h4>
            {review.product ? (
              <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={review.product.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">{review.product.name}</h5>
                    <p className="text-xs text-slate-500">Slug: {review.product.slug}</p>
                  </div>
                </div>
                <Link
                  href={`/products/${review.product.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-[#5b5bd6] hover:underline"
                >
                  Xem sản phẩm <ExternalLink size={13} />
                </Link>
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">Không tìm thấy thông tin sản phẩm</p>
            )}
          </div>

          {/* Nội dung nhận xét */}
          <div className="rounded-lg border border-slate-200/80 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Nội dung nhận xét của khách hàng
            </h4>
            {review.content ? (
              <div className="rounded-md bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-800">
                {review.content}
              </div>
            ) : (
              <div className="rounded-md bg-slate-50 p-3.5 text-xs italic text-slate-400">
                Khách hàng chỉ chấm sao và không để lại nhận xét văn bản.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onToggleHide(review)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                review.isHidden
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              {review.isHidden ? (
                <>
                  <Eye size={14} /> Hiển thị đánh giá
                </>
              ) : (
                <>
                  <EyeOff size={14} /> Ẩn đánh giá này
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onDelete(review)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} /> Xóa đánh giá
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
