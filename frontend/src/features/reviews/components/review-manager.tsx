"use client"

import * as React from "react"
import {
  Star,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Inbox,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Package,
  Award,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react"
import Link from "next/link"
import type { Review, ReviewStats } from "../types/review.types"
import { ReviewApiService } from "../api/review.service"
import { StarRating } from "./star-rating"
import { ReviewDetailModal } from "./review-detail-modal"

interface ReviewManagerProps {
  onNotice?: (msg: string) => void
}

export function ReviewManager({ onNotice }: ReviewManagerProps) {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [ratingFilter, setRatingFilter] = React.useState<string>("Tất cả")
  const [statusFilter, setStatusFilter] = React.useState<string>("Tất cả")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [stats, setStats] = React.useState<ReviewStats>({
    totalAll: 0,
    avgRating: 0,
    hiddenCount: 0,
  })

  // Modal xem chi tiết
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset trang về 1 khi đổi bộ lọc
  const handleRatingChange = (val: string) => {
    setRatingFilter(val)
    setPage(1)
  }

  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setPage(1)
  }

  const loadReviews = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await ReviewApiService.getAllReviews({
        page,
        limit: 10,
        search: debouncedSearch.trim() || undefined,
        rating: ratingFilter !== "Tất cả" ? Number(ratingFilter) : undefined,
        isHidden:
          statusFilter === "Bị ẩn"
            ? "true"
            : statusFilter === "Hiển thị"
            ? "false"
            : undefined,
      })

      setReviews(res.items || [])
      setTotalPages(res.pagination?.totalPages || 1)
      setTotalCount(res.pagination?.total || 0)

      if (res.stats) {
        setStats(res.stats)
      }
    } catch (err: any) {
      onNotice?.(err.message || "Không thể tải danh sách đánh giá.")
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, ratingFilter, statusFilter, onNotice])

  React.useEffect(() => {
    loadReviews()
  }, [loadReviews])

  // Thao tác Ẩn / Hiển thị đánh giá
  const handleToggleHide = async (review: Review) => {
    const nextState = !review.isHidden
    setUpdatingId(review.id)
    try {
      await ReviewApiService.setHidden(review.id, nextState)
      setReviews((prev) =>
        prev.map((item) =>
          item.id === review.id ? { ...item, isHidden: nextState } : item
        )
      )
      if (selectedReview?.id === review.id) {
        setSelectedReview((prev) =>
          prev ? { ...prev, isHidden: nextState } : null
        )
      }
      setStats((prev) => ({
        ...prev,
        hiddenCount: nextState
          ? prev.hiddenCount + 1
          : Math.max(0, prev.hiddenCount - 1),
      }))
      onNotice?.(
        nextState
          ? "Đã ẩn đánh giá khỏi trang sản phẩm."
          : "Đã cho phép hiển thị lại đánh giá."
      )
    } catch (err: any) {
      onNotice?.(err.message || "Lỗi khi cập nhật trạng thái đánh giá.")
    } finally {
      setUpdatingId(null)
    }
  }

  // Thao tác Xóa đánh giá
  const handleDelete = async (review: Review) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa đánh giá của "${review.user?.name || "Khách hàng"}" cho sản phẩm "${review.product?.name || "sản phẩm"}"?\nThao tác này không thể hoàn tác.`
    )
    if (!confirmed) return

    setUpdatingId(review.id)
    try {
      await ReviewApiService.deleteReview(review.id)
      setReviews((prev) => prev.filter((item) => item.id !== review.id))
      setTotalCount((prev) => Math.max(0, prev - 1))
      setStats((prev) => ({
        ...prev,
        totalAll: Math.max(0, prev.totalAll - 1),
        hiddenCount: review.isHidden
          ? Math.max(0, prev.hiddenCount - 1)
          : prev.hiddenCount,
      }))
      if (selectedReview?.id === review.id) {
        setSelectedReview(null)
      }
      onNotice?.("Đã xóa đánh giá thành công.")
    } catch (err: any) {
      onNotice?.(err.message || "Lỗi khi xóa đánh giá.")
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Trang */}
      <div className="tieu-de-trang">
        <div>
          <p className="loi-chao">Quản trị nội dung</p>
          <h1>Quản lý đánh giá sản phẩm</h1>
          <p className="mo-ta">
            Theo dõi, kiểm duyệt và quản lý các phản hồi, đánh giá sao từ khách hàng.
          </p>
        </div>
      </div>

      {/* 2. Thống kê 4 thẻ nhỏ */}
      <div className="luoi-the-nho">
        <div>
          <Star size={17} className="text-[#5b5bd6]" />
          <span>Tổng đánh giá</span>
          <strong>{stats.totalAll}</strong>
        </div>
        <div>
          <Award size={17} className="text-amber-500" />
          <span>Điểm trung bình</span>
          <strong className="flex items-center gap-1">
            {stats.avgRating > 0 ? `${stats.avgRating} / 5` : "5.0 / 5"}
            <span className="text-xs text-amber-500">★</span>
          </strong>
        </div>
        <div>
          <Eye size={17} className="text-emerald-600" />
          <span>Đang hiển thị</span>
          <strong>{Math.max(0, stats.totalAll - stats.hiddenCount)}</strong>
        </div>
        <div>
          <EyeOff size={17} className="text-rose-500" />
          <span>Đang bị ẩn</span>
          <strong className="text-rose-600">{stats.hiddenCount}</strong>
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
              placeholder="Tìm theo sản phẩm, khách hàng, nội dung..."
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={ratingFilter}
              onChange={(e) => handleRatingChange(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs"
            >
              <option value="Tất cả">Tất cả số sao</option>
              <option value="5">5 sao ★★★★★</option>
              <option value="4">4 sao ★★★★☆</option>
              <option value="3">3 sao ★★★☆☆</option>
              <option value="2">2 sao ★★☆☆☆</option>
              <option value="1">1 sao ★☆☆☆☆</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-xs"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Hiển thị">Đang hiển thị</option>
              <option value="Bị ẩn">Đang bị ẩn</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="nut-loc"
          onClick={loadReviews}
          disabled={loading}
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* 4. Bảng dữ liệu / Danh sách đánh giá */}
      <section className="the-noi-dung bang-du-lieu overflow-hidden">
        <div className="tieu-de-bang flex items-center justify-between border-b border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-800">
            Danh sách đánh giá{" "}
            <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {totalCount}
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            Trang {page} / {totalPages || 1}
          </span>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-[#5b5bd6]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="trang-rong py-14 text-center">
            <div className="icon-trang-rong mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox size={32} strokeWidth={1.5} />
            </div>
            <h2 className="mt-3 text-base font-bold text-slate-800">
              Không tìm thấy đánh giá nào
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Chưa có phản hồi nào phù hợp với bộ lọc tìm kiếm hiện tại.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="bang-cuon hidden md:block">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500">
                    <th className="py-3.5 px-4 font-semibold">Sản phẩm</th>
                    <th className="py-3.5 px-4 font-semibold">Khách hàng</th>
                    <th className="py-3.5 px-4 font-semibold">Đánh giá & Nội dung</th>
                    <th className="py-3.5 px-4 font-semibold">Thời gian</th>
                    <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                    <th className="py-3.5 px-4 text-right font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {reviews.map((rev) => {
                    const imgUrl = rev.product?.images?.[0]?.url
                    const userInitial =
                      rev.user?.name?.slice(0, 1)?.toUpperCase() || "U"

                    return (
                      <tr
                        key={rev.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* Cột Sản phẩm */}
                        <td className="py-3 px-4 max-w-[220px]">
                          {rev.product ? (
                            <div className="flex items-center gap-2.5">
                              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={rev.product.name}
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <Package size={16} className="text-slate-400" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <Link
                                  href={`/products/${rev.product.slug}`}
                                  target="_blank"
                                  className="block truncate font-semibold text-slate-800 hover:text-[#5b5bd6]"
                                  title={rev.product.name}
                                >
                                  {rev.product.name}
                                </Link>
                                <span className="block truncate text-[11px] text-slate-400">
                                  {rev.product.slug}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sản phẩm đã xóa</span>
                          )}
                        </td>

                        {/* Cột Khách hàng */}
                        <td className="py-3 px-4 max-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5b5bd6]/10 text-xs font-bold text-[#5b5bd6]">
                              {rev.user?.image ? (
                                <img
                                  src={rev.user.image}
                                  alt={rev.user.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                userInitial
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold text-slate-800">
                                {rev.user?.name || "Khách ẩn danh"}
                              </div>
                              <div className="truncate text-[11px] text-slate-400">
                                {rev.user?.email || "Chưa có email"}
                              </div>
                            </div>
                          </div>
                          {rev.verifiedPurchase && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                              <CheckCircle2 size={12} /> Đã mua hàng
                            </div>
                          )}
                        </td>

                        {/* Cột Đánh giá & Nội dung */}
                        <td className="py-3 px-4 max-w-[280px]">
                          <div className="flex items-center gap-1.5">
                            <StarRating value={rev.rating} size="sm" />
                            <span className="font-bold text-slate-800">
                              {rev.rating}.0
                            </span>
                          </div>
                          <p
                            className="mt-1 line-clamp-2 text-slate-600 cursor-pointer hover:text-slate-900"
                            onClick={() => setSelectedReview(rev)}
                            title="Bấm để xem đầy đủ"
                          >
                            {rev.content || (
                              <span className="italic text-slate-400">
                                Không có nhận xét văn bản
                              </span>
                            )}
                          </p>
                        </td>

                        {/* Cột Thời gian */}
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                          {formatDate(rev.createdAt)}
                        </td>

                        {/* Cột Trạng thái */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              rev.isHidden
                                ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            }`}
                          >
                            {rev.isHidden ? (
                              <>
                                <EyeOff size={11} /> Đang ẩn
                              </>
                            ) : (
                              <>
                                <Eye size={11} /> Hiển thị
                              </>
                            )}
                          </span>
                        </td>

                        {/* Cột Hành động */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedReview(rev)}
                              className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:border-[#5b5bd6] hover:text-[#5b5bd6]"
                              title="Xem chi tiết"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              type="button"
                              disabled={updatingId === rev.id}
                              onClick={() => handleToggleHide(rev)}
                              className={`rounded-md border p-1.5 transition ${
                                rev.isHidden
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                              title={rev.isHidden ? "Cho phép hiển thị" : "Ẩn đánh giá"}
                            >
                              {rev.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>

                            <button
                              type="button"
                              disabled={updatingId === rev.id}
                              onClick={() => handleDelete(rev)}
                              className="rounded-md border border-red-200 bg-white p-1.5 text-red-600 hover:bg-red-50"
                              title="Xóa đánh giá"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="divide-y divide-slate-100 md:hidden">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <StarRating value={rev.rating} size="sm" />
                        <span className="text-xs font-bold text-slate-800">
                          {rev.rating}.0
                        </span>
                      </div>
                      <h4 className="mt-1 font-semibold text-slate-900 truncate">
                        {rev.product?.name || "Sản phẩm"}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Bởi {rev.user?.name} · {formatDate(rev.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        rev.isHidden
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {rev.isHidden ? "Đang ẩn" : "Hiển thị"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {rev.content || <span className="italic text-slate-400">Không có lời nhận xét</span>}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => setSelectedReview(rev)}
                      className="text-xs font-medium text-[#5b5bd6]"
                    >
                      Xem chi tiết
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleHide(rev)}
                        className="text-xs font-medium text-slate-600"
                      >
                        {rev.isHidden ? "Hiện" : "Ẩn"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rev)}
                        className="text-xs font-medium text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang (Pagination) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
              <div>
                Đang hiển thị <strong>{reviews.length}</strong> trên tổng số{" "}
                <strong>{totalCount}</strong> đánh giá
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  title="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1]
                    const needEllipsis = prevP && p - prevP > 1

                    return (
                      <React.Fragment key={p}>
                        {needEllipsis && (
                          <span className="px-1 text-slate-400">...</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`size-8 rounded-md font-semibold transition ${
                            page === p
                              ? "bg-[#5b5bd6] text-white shadow-xs"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                  className="flex size-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                  title="Trang tiếp theo"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 5. Modal Chi Tiết */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onToggleHide={handleToggleHide}
          onDelete={handleDelete}
          isUpdating={updatingId === selectedReview.id}
        />
      )}
    </div>
  )
}
