"use client"

import * as React from "react"
import {
  Users,
  UserPlus,
  ShoppingBag,
  UserX,
  Search,
  SlidersHorizontal,
  Plus,
  Eye,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  Inbox,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import type { Customer, CustomerStats } from "../types/customer.types"
import { CustomerService } from "../services/customer.service"
import { CustomerDetailModal } from "./customer-detail-modal"
import { CustomerFormModal } from "./customer-form-modal"

interface CustomerManagerProps {
  onNotice?: (msg: string) => void
}

export function CustomerManager({ onNotice }: CustomerManagerProps) {
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("Tất cả")

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const loadCustomers = React.useCallback(async () => {
    setLoading(true)
    try {
      const data = await CustomerService.fetchCustomers()
      setCustomers(data)
    } catch {
      onNotice?.("Không thể tải danh sách khách hàng")
    } finally {
      setLoading(false)
    }
  }, [onNotice])

  React.useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  // Thống kê 4 số liệu
  const stats: CustomerStats = React.useMemo(() => {
    const total = customers.length
    // Khách mới trong tháng hiện tại
    const currentMonth = new Date().toISOString().slice(0, 7)
    const newCustomers = customers.filter((c) => c.registeredAt?.startsWith(currentMonth)).length
    const purchased = customers.filter((c) => c.totalOrders > 0).length
    const noPurchases = customers.filter((c) => c.totalOrders === 0).length

    return { total, newCustomers, purchased, noPurchases }
  }, [customers])

  // Lọc theo tìm kiếm và trạng thái
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus = statusFilter === "Tất cả" || c.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [customers, searchTerm, statusFilter])

  // Xóa khách hàng có xác nhận
  const handleDelete = async (customer: Customer) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa khách hàng "${customer.name}" (${customer.code})?\nHành động này không thể hoàn tác.`
    )
    if (!confirmed) return

    try {
      await CustomerService.deleteCustomer(customer.id)
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id))
      onNotice?.(`Đã xóa khách hàng ${customer.name} thành công`)
      if (selectedCustomer?.id === customer.id) setSelectedCustomer(null)
    } catch {
      onNotice?.("Lỗi khi xóa khách hàng")
    }
  }

  // Khóa / mở khóa
  const handleToggleStatus = async (customer: Customer) => {
    try {
      const updated = await CustomerService.toggleStatus(customer.id)
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      if (selectedCustomer?.id === updated.id) setSelectedCustomer(updated)
      onNotice?.(`Đã ${updated.status === "Bị khóa" ? "khóa" : "mở khóa"} tài khoản ${customer.name}`)
    } catch {
      onNotice?.("Không thể thay đổi trạng thái tài khoản")
    }
  }

  // Lưu thêm / sửa
  const handleSaveCustomer = async (formData: any) => {
    if (editingCustomer) {
      const updated = await CustomerService.updateCustomer(editingCustomer.id, formData)
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      if (selectedCustomer?.id === updated.id) setSelectedCustomer(updated)
      onNotice?.("Cập nhật thông tin khách hàng thành công")
    } else {
      const added = await CustomerService.addCustomer(formData)
      setCustomers((prev) => [added, ...prev])
      onNotice?.("Thêm mới khách hàng thành công")
    }
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val)

  return (
    <>
      {/* Tiêu đề & Nút thêm mới */}
      <div className="tieu-de-trang">
        <div>
          <p className="loi-chao">Quản lý bán hàng</p>
          <h1>Khách hàng</h1>
          <p className="mo-ta">Theo dõi thông tin, lịch sử mua hàng và quản lý tài khoản khách hàng.</p>
        </div>
        <button
          className="nut-chinh"
          onClick={() => {
            setEditingCustomer(null)
            setIsFormOpen(true)
          }}
        >
          <Plus size={17} /> Thêm khách hàng
        </button>
      </div>

      {/* 1. Thống kê 4 thẻ nhỏ */}
      <div className="luoi-the-nho">
        <div>
          <Users size={17} />
          <span>Tổng khách hàng</span>
          <strong>{stats.total}</strong>
        </div>
        <div>
          <UserPlus size={17} />
          <span>Khách hàng mới</span>
          <strong>{stats.newCustomers}</strong>
        </div>
        <div>
          <ShoppingBag size={17} />
          <span>Đã mua hàng</span>
          <strong>{stats.purchased}</strong>
        </div>
        <div>
          <UserX size={17} />
          <span>Chưa mua hàng</span>
          <strong>{stats.noPurchases}</strong>
        </div>
      </div>

      {/* 2. Thanh công cụ tìm kiếm & lọc */}
      <div className="thanh-cong-cu flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="o-tim-kiem min-w-[220px] flex-1 sm:max-w-xs">
            <Search size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã, tên, email, SĐT..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Hoạt động">Đang hoạt động</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="nut-loc"
            onClick={loadCustomers}
            disabled={loading}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* 3. Danh sách khách hàng (Bảng Desktop + Thẻ Mobile) */}
      <section className="the-noi-dung bang-du-lieu">
        <div className="tieu-de-bang">
          <div>
            <h2>
              Danh sách khách hàng <span>{filteredCustomers.length}</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <RefreshCw className="size-7 animate-spin text-[#5b5bd6]" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <Inbox size={42} strokeWidth={1.5} className="mb-2" />
            <strong className="text-slate-700">Không tìm thấy khách hàng nào</strong>
            <p className="mt-1 text-xs text-slate-500">
              {searchTerm || statusFilter !== "Tất cả"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc."
                : "Hệ thống chưa có khách hàng nào. Nhấn Thêm khách hàng để tạo mới."}
            </p>
          </div>
        ) : (
          <>
            {/* Table dành cho máy tính (Desktop) */}
            <div className="bang-cuon hidden md:block">
              <table>
                <thead>
                  <tr>
                    <th>Mã KH</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Tổng đơn</th>
                    <th>Tổng chi tiêu</th>
                    <th>Ngày đăng ký</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/60">
                      <td>
                        <strong className="text-slate-800">{cust.code}</strong>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#5b5bd6]/10 text-xs font-bold text-[#5b5bd6]">
                            {cust.avatar ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                className="size-7 rounded-full object-cover"
                              />
                            ) : (
                              cust.name.slice(0, 1).toUpperCase()
                            )}
                          </div>
                          <span
                            onClick={() => setSelectedCustomer(cust)}
                            className="cursor-pointer font-medium text-slate-800 hover:text-[#5b5bd6] hover:underline"
                          >
                            {cust.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-slate-600">{cust.email || "—"}</span>
                      </td>
                      <td>
                        <span className="text-slate-600">{cust.phone || "—"}</span>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-800">{cust.totalOrders}</span>
                      </td>
                      <td>
                        <strong className="text-emerald-600">{formatCurrency(cust.totalSpent)}</strong>
                      </td>
                      <td>
                        <span className="text-slate-500">{cust.registeredAt}</span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            cust.status === "Hoạt động"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              cust.status === "Hoạt động" ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                          {cust.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(cust)}
                            className="nut-loc"
                            style={{ height: "29px", padding: "0 8px" }}
                            title="Xem chi tiết"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCustomer(cust)
                              setIsFormOpen(true)
                            }}
                            className="nut-loc"
                            style={{ height: "29px", padding: "0 8px" }}
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cust)}
                            className="nut-loc"
                            style={{
                              height: "29px",
                              padding: "0 8px",
                              color: cust.status === "Hoạt động" ? "#d97706" : "#059669",
                            }}
                            title={cust.status === "Hoạt động" ? "Khóa tài khoản" : "Mở khóa"}
                          >
                            {cust.status === "Hoạt động" ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cust)}
                            className="nut-loc"
                            style={{ height: "29px", padding: "0 8px", color: "#ef4444" }}
                            title="Xóa khách hàng"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Hiển thị dạng thẻ trên điện thoại) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 items-center justify-center rounded-full bg-[#5b5bd6]/10 text-xs font-bold text-[#5b5bd6]">
                        {cust.avatar ? (
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          cust.name.slice(0, 1).toUpperCase()
                        )}
                      </div>
                      <div>
                        <strong
                          onClick={() => setSelectedCustomer(cust)}
                          className="block text-sm text-slate-800 hover:text-[#5b5bd6]"
                        >
                          {cust.name}
                        </strong>
                        <span className="text-[11px] text-slate-400">Mã: {cust.code}</span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        cust.status === "Hoạt động"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {cust.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-b border-slate-100 py-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Tổng đơn hàng</span>
                      <strong className="text-slate-800">{cust.totalOrders} đơn</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Tổng chi tiêu</span>
                      <strong className="text-emerald-600">{formatCurrency(cust.totalSpent)}</strong>
                    </div>
                    <div className="col-span-2 space-y-1 pt-1 text-[11px]">
                      {cust.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                      {cust.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-400 shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="nut-loc text-xs px-2.5 h-8 gap-1"
                    >
                      <Eye size={13} /> Xem
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCustomer(cust)
                        setIsFormOpen(true)
                      }}
                      className="nut-loc text-xs px-2.5 h-8 gap-1"
                    >
                      <Edit2 size={13} /> Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cust)}
                      className="nut-loc text-xs px-2.5 h-8"
                      style={{ color: cust.status === "Hoạt động" ? "#d97706" : "#059669" }}
                    >
                      {cust.status === "Hoạt động" ? <Lock size={13} /> : <Unlock size={13} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cust)}
                      className="nut-loc text-xs px-2.5 h-8 text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal Xem chi tiết khách hàng */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onEdit={() => {
            setEditingCustomer(selectedCustomer)
            setSelectedCustomer(null)
            setIsFormOpen(true)
          }}
          onToggleStatus={() => handleToggleStatus(selectedCustomer)}
        />
      )}

      {/* Modal Thêm / Chỉnh sửa khách hàng */}
      {isFormOpen && (
        <CustomerFormModal
          initialData={editingCustomer}
          onClose={() => {
            setIsFormOpen(false)
            setEditingCustomer(null)
          }}
          onSave={handleSaveCustomer}
        />
      )}
    </>
  )
}
