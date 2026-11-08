"use client"

import * as React from "react"
import { X } from "lucide-react"
import type { Customer } from "../types/customer.types"

interface CustomerFormModalProps {
  initialData?: Customer | null
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

export function CustomerFormModal({ initialData, onClose, onSave }: CustomerFormModalProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [email, setEmail] = React.useState(initialData?.email || "")
  const [phone, setPhone] = React.useState(initialData?.phone || "")
  const [gender, setGender] = React.useState<"Nam" | "Nữ" | "Khác">(initialData?.gender || "Nam")
  const [dateOfBirth, setDateOfBirth] = React.useState(initialData?.dateOfBirth || "")
  const [status, setStatus] = React.useState<"Hoạt động" | "Bị khóa">(initialData?.status || "Hoạt động")
  const [province, setProvince] = React.useState(initialData?.province || "")
  const [district, setDistrict] = React.useState(initialData?.district || "")
  const [ward, setWard] = React.useState(initialData?.ward || "")
  const [addressDetail, setAddressDetail] = React.useState(initialData?.addressDetail || "")
  const [errorMsg, setErrorMsg] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên khách hàng.")
      return
    }
    if (!email.trim() && !phone.trim()) {
      setErrorMsg("Vui lòng cung cấp ít nhất email hoặc số điện thoại.")
      return
    }

    setIsSaving(true)
    setErrorMsg("")
    try {
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth: dateOfBirth || undefined,
        status,
        province: province.trim() || undefined,
        district: district.trim() || undefined,
        ward: ward.trim() || undefined,
        addressDetail: addressDetail.trim() || undefined,
      })
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi khi lưu thông tin.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">
            {initialData ? "Chỉnh sửa thông tin khách hàng" : "Thêm mới khách hàng"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="space-y-4 p-6 text-xs text-slate-700">
            {errorMsg && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="mb-1 block font-semibold text-slate-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khachhang@example.com"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Giới tính</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-md border border-slate-200 px-2 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Ngày sinh</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-2 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold text-slate-700">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-md border border-slate-200 px-2 py-2 text-xs focus:border-[#5b5bd6] focus:outline-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Bị khóa">Bị khóa</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3.5">
              <span className="font-semibold text-slate-800">Địa chỉ giao hàng</span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="Tỉnh/Thành phố"
                  className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận/Huyện"
                  className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Phường/Xã"
                  className="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                />
              </div>
              <input
                type="text"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="Số nhà, tên đường chi tiết..."
                className="w-full rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="nut-loc text-xs">
              Hủy
            </button>
            <button type="submit" disabled={isSaving} className="nut-chinh text-xs">
              {isSaving ? "Đang lưu..." : initialData ? "Lưu thay đổi" : "Thêm khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
