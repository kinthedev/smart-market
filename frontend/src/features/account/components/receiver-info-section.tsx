"use client"

import React, { useState } from "react"
import {
  AlertCircle,
  Check,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { vietnamLocations } from "../data/locations"
import { receiverInfoSchema } from "../schemas/account.schema"
import { AccountApiService } from "../api/account.service"
import { AddressFormFields, formatFullAddress } from "./address-form-fields"
import type { AddressFormValue, ReceiverAddress } from "../types/account.types"

interface ReceiverInfoSectionProps {
  addresses: ReceiverAddress[]
  isLoading?: boolean
  onChanged: () => Promise<void> | void
  onHasUnsavedChanges: (hasChanges: boolean) => void
}

const emptyForm: AddressFormValue = {
  receiverName: "",
  receiverPhone: "",
  provinceId: "",
  districtId: "",
  ward: "",
  addressDetail: "",
}

export function ReceiverInfoSection({
  addresses,
  isLoading = false,
  onChanged,
  onHasUnsavedChanges,
}: ReceiverInfoSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ReceiverAddress | null>(null)
  const [formData, setFormData] = useState<AddressFormValue>(emptyForm)
  const [makeDefault, setMakeDefault] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const openAddForm = () => {
    setEditingAddress(null)
    setFormData(emptyForm)
    setMakeDefault(addresses.length === 0)
    setErrors({})
    setNotification(null)
    setIsFormOpen(true)
  }

  const openEditForm = (address: ReceiverAddress) => {
    setEditingAddress(address)
    setFormData({
      receiverName: address.receiverName,
      receiverPhone: address.receiverPhone,
      provinceId: address.provinceId,
      districtId: address.districtId,
      ward: address.ward,
      addressDetail: address.addressDetail,
    })
    setMakeDefault(address.isDefault)
    setErrors({})
    setNotification(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAddress(null)
    setFormData(emptyForm)
    setErrors({})
    onHasUnsavedChanges(false)
  }

  const handleChange = (next: AddressFormValue) => {
    setFormData(next)
    setErrors({})
    onHasUnsavedChanges(true)
  }

  const handleSave = async () => {
    const result = receiverInfoSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    const province = vietnamLocations.find((p) => p.id === formData.provinceId)
    const district = province?.districts.find((d) => d.id === formData.districtId)

    if (!province || !district) {
      setNotification({
        type: "error",
        message: "Tỉnh/Thành phố hoặc Quận/Huyện không hợp lệ.",
      })
      return
    }

    setIsSaving(true)
    setNotification(null)
    try {
      const payload = {
        ...formData,
        province: province.name,
        district: district.name,
        isDefault: makeDefault,
      }

      if (editingAddress) {
        await AccountApiService.updateAddress(editingAddress.id, payload)
      } else {
        await AccountApiService.createAddress(payload)
      }

      await onChanged()
      closeForm()
      setNotification({
        type: "success",
        message: editingAddress
          ? "Cập nhật thông tin người nhận thành công!"
          : "Thêm thông tin người nhận thành công!",
      })
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error?.message || "Không thể lưu thông tin người nhận.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetDefault = async (address: ReceiverAddress) => {
    if (address.isDefault) return
    setBusyId(address.id)
    setNotification(null)
    try {
      await AccountApiService.setDefaultAddress(address.id)
      await onChanged()
      setNotification({
        type: "success",
        message: "Đã đặt làm địa chỉ mặc định.",
      })
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error?.message || "Không thể đặt địa chỉ mặc định.",
      })
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (address: ReceiverAddress) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa thông tin người nhận "${address.receiverName}"?`
    )
    if (!confirmed) return

    setBusyId(address.id)
    setNotification(null)
    try {
      await AccountApiService.deleteAddress(address.id)
      await onChanged()
      setNotification({
        type: "success",
        message: "Đã xóa thông tin người nhận.",
      })
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error?.message || "Không thể xóa thông tin người nhận.",
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Thông Tin Người Nhận</h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Lưu nhiều thông tin người nhận để chọn nhanh khi thanh toán
          </p>
        </div>
        <Button
          type="button"
          onClick={openAddForm}
          className="mt-1 h-9 self-start rounded-sm bg-orange-500 text-xs font-bold text-white hover:bg-orange-600 sm:mt-0"
        >
          <Plus className="size-4" />
          Thêm người nhận
        </Button>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-sm p-3 text-xs sm:text-sm ${
            notification.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="size-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="size-4 shrink-0 text-red-600" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Đóng thông báo"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" />
          Đang tải thông tin người nhận...
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
            <User className="size-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Chưa có thông tin người nhận nào
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Thêm thông tin người nhận để dùng lại khi đặt hàng.
          </p>
          <Button
            type="button"
            onClick={openAddForm}
            className="mt-4 h-9 rounded-sm bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600"
          >
            Thêm thông tin người nhận
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {addresses.map((address) => {
            const isBusy = busyId === address.id
            return (
              <article
                key={address.id}
                className={`relative flex flex-col rounded-lg border p-4 transition ${
                  address.isDefault
                    ? "border-orange-300 bg-orange-50/40"
                    : "border-slate-200 bg-white hover:border-orange-200"
                }`}
              >
                {address.isDefault && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Star className="size-3" /> Mặc định
                  </span>
                )}

                <div className="flex items-center gap-2 pr-20">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <User className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {address.receiverName}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="size-3" />
                      {address.receiverPhone}
                    </p>
                  </div>
                </div>

                <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                  <span>
                    {formatFullAddress({
                      addressDetail: address.addressDetail,
                      ward: address.ward,
                      district: address.district,
                      province: address.province,
                    })}
                  </span>
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  {!address.isDefault && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleSetDefault(address)}
                      className="inline-flex items-center gap-1 rounded-sm border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50"
                    >
                      {isBusy ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Star className="size-3.5" />
                      )}
                      Chọn mặc định
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => openEditForm(address)}
                    className="inline-flex items-center gap-1 rounded-sm border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-orange-400 hover:text-orange-600 disabled:opacity-50"
                  >
                    <Pencil className="size-3.5" />
                    Sửa
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleDelete(address)}
                    className="ml-auto inline-flex items-center gap-1 rounded-sm px-2 py-1.5 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <Trash2 className="size-3.5" />
                    Xóa
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
          <div className="my-4 w-full max-w-lg rounded-lg bg-white p-5 shadow-xl sm:my-0 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingAddress ? "Sửa thông tin người nhận" : "Thêm thông tin người nhận"}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Thông tin này sẽ hiển thị để chọn khi thanh toán.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Đóng"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4">
              <AddressFormFields
                value={formData}
                onChange={handleChange}
                errors={errors}
                disabled={isSaving}
              />
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-md bg-orange-50/60 px-3 py-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={editingAddress?.isDefault ? true : makeDefault}
                disabled={isSaving || Boolean(editingAddress?.isDefault)}
                onChange={(e) => setMakeDefault(e.target.checked)}
                className="size-4 accent-orange-500"
              />
              {editingAddress?.isDefault
                ? "Địa chỉ này đang là mặc định"
                : "Đặt làm địa chỉ mặc định"}
            </label>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={closeForm}
                className="h-9 rounded-sm border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="h-9 rounded-sm bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  "Lưu thông tin"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
