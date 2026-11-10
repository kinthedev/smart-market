"use client"

import * as React from "react"
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Inbox,
  Package,
  RefreshCw,
  Search,
  Warehouse,
  X,
} from "lucide-react"
import { InventoryApiService } from "../api/inventory.service"
import type {
  InventoryStats,
  InventoryStockStatus,
  InventoryVariant,
} from "../types/inventory.types"

const STATS_INITIAL: InventoryStats = {
  totalVariants: 0,
  totalStock: 0,
  lowStock: 0,
  outOfStock: 0,
  lowStockThreshold: 5,
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Number(value) || 0)
}

function variantLabel(variant: InventoryVariant) {
  const parts = [variant.size, variant.color].filter(Boolean)
  return parts.length > 0 ? parts.join(" / ") : "Mặc định"
}

function stockLevel(stock: number, threshold: number) {
  if (stock <= 0) {
    return {
      label: "Hết hàng",
      className: "bg-rose-50 text-rose-700 ring-rose-200",
      dot: "bg-rose-500",
    }
  }
  if (stock <= threshold) {
    return {
      label: "Sắp hết",
      className: "bg-amber-50 text-amber-700 ring-amber-200",
      dot: "bg-amber-500",
    }
  }
  return {
    label: "Còn hàng",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  }
}

interface InventoryManagerProps {
  onNotice?: (msg: string) => void
}

export function InventoryManager({ onNotice }: InventoryManagerProps) {
  const [variants, setVariants] = React.useState<InventoryVariant[]>([])
  const [stats, setStats] = React.useState<InventoryStats>(STATS_INITIAL)
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [stockStatus, setStockStatus] = React.useState<InventoryStockStatus>("ALL")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
  const [savingId, setSavingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadInventory = React.useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true)
      try {
        const result = await InventoryApiService.getInventory({
          page,
          limit: 10,
          search: debouncedSearch.trim() || undefined,
          stockStatus: stockStatus === "ALL" ? undefined : stockStatus,
        })

        setVariants(result.items || [])
        setStats(result.stats || STATS_INITIAL)
        setTotalCount(result.pagination?.total || 0)
        setTotalPages(result.pagination?.totalPages || 1)
      } catch (error: any) {
        onNotice?.(error?.message || "Không thể tải dữ liệu tồn kho.")
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [page, debouncedSearch, stockStatus, onNotice]
  )

  React.useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const startEdit = (variant: InventoryVariant) => {
    setEditingId(variant.id)
    setEditingValue(String(variant.stock))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingValue("")
  }

  const saveEdit = async (variant: InventoryVariant) => {
    const nextStock = Number(editingValue)

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      onNotice?.("Số lượng tồn kho phải là số nguyên không âm.")
      return
    }

    if (nextStock === variant.stock) {
      cancelEdit()
      return
    }

    setSavingId(variant.id)
    try {
      const updated = await InventoryApiService.updateStock(variant.id, nextStock)
      setVariants((prev) =>
        prev.map((item) => (item.id === variant.id ? { ...item, ...updated } : item))
      )
      onNotice?.(
        `Đã cập nhật tồn kho "${variant.product.name}" (${variantLabel(
          variant
        )}) thành ${formatNumber(nextStock)}.`
      )
      cancelEdit()
      // Tải lại ngầm để đồng bộ thống kê và bộ lọc
      await loadInventory(true)
    } catch (error: any) {
      onNotice?.(error?.message || "Không thể cập nhật tồn kho.")
    } finally {
      setSavingId(null)
    }
  }

  const pageNumbers = React.useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
    )
  }, [page, totalPages])

  return (
    <>
      {/* 1. Tiêu đề */}
      <div className="tieu-de-trang">
        <div>
          <p className="loi-chao">Quản lý bán hàng</p>
          <h1>Kho hàng</h1>
          <p className="mo-ta">
            Theo dõi tồn kho theo từng biến thể (kích thước / màu sắc) và điều chỉnh
            nhanh số lượng khi cần.
          </p>
        </div>
      </div>

      {/* 2. Thẻ thống kê */}
      <div className="luoi-the-nho">
        <div>
          <Package size={17} className="text-[#5b5bd6]" />
          <span>Tổng biến thể</span>
          <strong>{formatNumber(stats.totalVariants)}</strong>
        </div>
        <div>
          <Warehouse size={17} className="text-emerald-600" />
          <span>Tổng tồn kho</span>
          <strong>{formatNumber(stats.totalStock)}</strong>
        </div>
        <div>
          <AlertTriangle size={17} className="text-amber-500" />
          <span>Sắp hết (≤ {stats.lowStockThreshold})</span>
          <strong>{formatNumber(stats.lowStock)}</strong>
        </div>
        <div>
          <X size={17} className="text-rose-500" />
          <span>Hết hàng</span>
          <strong className="text-rose-600">{formatNumber(stats.outOfStock)}</strong>
        </div>
      </div>

      {/* 3. Thanh công cụ */}
      <div className="thanh-cong-cu flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="o-tim-kiem min-w-[240px] flex-1 sm:max-w-xs">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, SKU, size, màu..."
            />
          </div>

          <select
            value={stockStatus}
            onChange={(e) => {
              setStockStatus(e.target.value as InventoryStockStatus)
              setPage(1)
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
          >
            <option value="ALL">Tất cả mức tồn</option>
            <option value="in">Còn hàng</option>
            <option value="low">Sắp hết</option>
            <option value="out">Hết hàng</option>
          </select>
        </div>

        <button
          type="button"
          className="nut-loc"
          onClick={() => loadInventory()}
          disabled={loading}
          title="Làm mới dữ liệu"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* 4. Bảng tồn kho */}
      <section className="the-noi-dung bang-du-lieu">
        <div className="tieu-de-bang">
          <div>
            <h2>
              Tồn kho theo biến thể <span>{totalCount}</span>
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
        ) : variants.length === 0 ? (
          <div className="trang-rong flex flex-col items-center justify-center py-14 text-center">
            <Inbox size={44} strokeWidth={1.5} className="mb-2 text-slate-400" />
            <strong className="text-[15px] text-slate-700">
              Không có biến thể nào phù hợp
            </strong>
            <p className="mt-1 text-[13px] text-slate-500">
              {debouncedSearch || stockStatus !== "ALL"
                ? "Thử thay đổi từ khóa hoặc bỏ bộ lọc mức tồn."
                : "Biến thể sẽ xuất hiện sau khi bạn thêm sản phẩm có kích thước/màu sắc."}
            </p>
          </div>
        ) : (
          <>
            {/* Bảng cho máy tính */}
            <div className="bang-cuon hidden md:block">
              <table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Phân loại</th>
                    <th>Tồn kho</th>
                    <th>Mức tồn</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => {
                    const level = stockLevel(variant.stock, stats.lowStockThreshold)
                    const isEditing = editingId === variant.id
                    const isSaving = savingId === variant.id
                    const imageUrl = variant.product.images?.[0]?.url

                    return (
                      <tr key={variant.id} className="hover:bg-slate-50/60">
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={variant.product.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <Package size={15} className="text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <strong className="block max-w-[220px] truncate text-slate-800">
                                {variant.product.name}
                              </strong>
                              <span className="block text-[10px] text-slate-400">
                                SKU: {variant.product.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-slate-600">{variantLabel(variant)}</span>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={editingValue}
                              autoFocus
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(variant)
                                if (e.key === "Escape") cancelEdit()
                              }}
                              className="w-24 rounded-md border border-[#5b5bd6] bg-white px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                            />
                          ) : (
                            <strong className="text-slate-800">
                              {formatNumber(variant.stock)}
                            </strong>
                          )}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${level.className}`}
                          >
                            <span className={`size-1.5 rounded-full ${level.dot}`} />
                            {level.label}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => saveEdit(variant)}
                                  className="rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                                  title="Lưu số lượng"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={cancelEdit}
                                  className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                  title="Hủy"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEdit(variant)}
                                className="nut-loc"
                                style={{ height: "29px", padding: "0 9px", gap: "4px" }}
                                title="Điều chỉnh tồn kho"
                              >
                                <Edit2 size={13} /> Sửa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Thẻ cho điện thoại */}
            <div className="divide-y divide-slate-100 md:hidden">
              {variants.map((variant) => {
                const level = stockLevel(variant.stock, stats.lowStockThreshold)
                const isEditing = editingId === variant.id

                return (
                  <div key={variant.id} className="space-y-2.5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <strong className="block truncate text-sm text-slate-800">
                          {variant.product.name}
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          {variantLabel(variant)} · SKU: {variant.product.sku}
                        </span>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${level.className}`}
                      >
                        <span className={`size-1.5 rounded-full ${level.dot}`} />
                        {level.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={editingValue}
                          autoFocus
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(variant)
                            if (e.key === "Escape") cancelEdit()
                          }}
                          className="w-24 rounded-md border border-[#5b5bd6] px-2 py-1.5 text-xs font-semibold"
                        />
                      ) : (
                        <span className="text-xs text-slate-600">
                          Tồn kho:{" "}
                          <strong className="text-slate-800">
                            {formatNumber(variant.stock)}
                          </strong>
                        </span>
                      )}

                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={savingId === variant.id}
                            onClick={() => saveEdit(variant)}
                            className="nut-loc text-xs"
                            style={{ height: "32px", padding: "0 10px" }}
                          >
                            <Check size={13} /> Lưu
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="nut-loc text-xs"
                            style={{ height: "32px", padding: "0 10px" }}
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(variant)}
                          className="nut-loc text-xs"
                          style={{ height: "32px", padding: "0 10px" }}
                        >
                          <Edit2 size={13} /> Sửa
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Phân trang */}
            <div className="phan-trang">
              <span>
                Hiển thị <strong>{variants.length}</strong> trên{" "}
                <strong>{totalCount}</strong> biến thể
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
    </>
  )
}
