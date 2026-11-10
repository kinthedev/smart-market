"use client"

import React, { useEffect, useMemo, useState } from "react"
import { MapPin, Check, AlertCircle, Phone, User, Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { vietnamLocations } from "../data/locations"
import { receiverInfoSchema } from "../schemas/account.schema"
import { AccountApiService } from "../api/account.service"
import { AddressFormFields, formatFullAddress } from "./address-form-fields"
import type { AddressFormValue, ReceiverAddress } from "../types/account.types"

interface AddressSectionProps {
  defaultAddress: ReceiverAddress | null
  isLoading?: boolean
  suggestedName?: string
  suggestedPhone?: string
  onSaved: () => Promise<void> | void
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

export function AddressSection({
  defaultAddress,
  isLoading = false,
  suggestedName = "",
  suggestedPhone = "",
  onSaved,
  onHasUnsavedChanges,
}: AddressSectionProps) {
  const [formData, setFormData] = useState<AddressFormValue>(emptyForm)
  const [savedData, setSavedData] = useState<AddressFormValue>(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  // Đồng bộ dữ liệu mặc định từ DB vào form.
  useEffect(() => {
    const next: AddressFormValue = defaultAddress
      ? {
          receiverName: defaultAddress.receiverName,
          receiverPhone: defaultAddress.receiverPhone,
          provinceId: defaultAddress.provinceId,
          districtId: defaultAddress.districtId,
          ward: defaultAddress.ward,
          addressDetail: defaultAddress.addressDetail,
        }
      : {
          ...emptyForm,
          receiverName: suggestedName,
          receiverPhone: suggestedPhone,
        }

    setSavedData(next)
    setFormData(next)
    onHasUnsavedChanges(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress?.id, suggestedName, suggestedPhone])

  const fullAddress = useMemo(() => {
    if (!defaultAddress) return ""
    return formatFullAddress({
      addressDetail: defaultAddress.addressDetail,
      ward: defaultAddress.ward,
      district: defaultAddress.district,
      province: defaultAddress.province,
    })
  }, [defaultAddress])

  const checkChanges = (next: AddressFormValue) => {
    onHasUnsavedChanges(JSON.stringify(next) !== JSON.stringify(savedData))
  }

  const handleChange = (next: AddressFormValue) => {
    setFormData(next)
    checkChanges(next)
    setErrors({})
    if (notification) setNotification(null)
  }

  const handleCancel = () => {
    setFormData(savedData)
    setErrors({})
    setIsEditing(false)
    setNotification(null)
    onHasUnsavedChanges(false)
  }

  const handleSave = async () => {
    setNotification(null)
    const result = receiverInfoSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      setNotification({
        type: "error",
        message: "Vui lòng nhập đầy đủ và chính xác thông tin địa chỉ.",
      })
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
    try {
      const payload = {
        ...formData,
        province: province.name,
        district: district.name,
        isDefault: true,
      }

      if (defaultAddress) {
        await AccountApiService.updateAddress(defaultAddress.id, payload)
      } else {
        await AccountApiService.createAddress(payload)
      }

      await onSaved()
      setSavedData(formData)
      setIsEditing(false)
      onHasUnsavedChanges(false)
      setNotification({
        type: "success",
        message: "Lưu địa chỉ cá nhân thành công!",
      })
    } catch (error: any) {
      setNotification({
        type: "error",
        message: error?.message || "Không thể lưu địa chỉ. Vui lòng thử lại.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
        <Loader2 className="size-4 animate-spin" />
        Đang tải địa chỉ cá nhân...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Địa Chỉ Cá Nhân</h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Địa chỉ mặc định dùng khi đặt hàng và được lưu trực tiếp vào tài khoản
          </p>
        </div>
        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="mt-2 h-9 self-start rounded-sm border-orange-500 text-xs font-semibold text-orange-600 hover:bg-orange-50 sm:mt-0"
          >
            {defaultAddress ? "Chỉnh sửa" : "Thêm địa chỉ"}
          </Button>
        ) : (
          <div className="mt-3 flex items-center gap-2 sm:mt-0">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleCancel}
              className="h-9 rounded-sm border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="h-9 rounded-sm bg-orange-500 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-600"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        )}
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
          <span>{notification.message}</span>
        </div>
      )}

      {/* Chế độ xem */}
      {!isEditing &&
        (defaultAddress ? (
          <div className="rounded-lg border border-orange-100 bg-orange-50/40 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                <MapPin className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-orange-800">
                  Địa chỉ mặc định hiện tại
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-slate-900">
                  <span className="inline-flex items-center gap-1">
                    <User className="size-3.5 text-slate-500" />
                    {defaultAddress.receiverName}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                    <Phone className="size-3.5 text-slate-500" />
                    {defaultAddress.receiverPhone}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{fullAddress}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
              <MapPin className="size-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Bạn chưa thiết lập địa chỉ cá nhân
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Thêm địa chỉ để điền nhanh khi thanh toán đơn hàng.
            </p>
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-4 h-9 rounded-sm bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600"
            >
              Thêm địa chỉ ngay
            </Button>
          </div>
        ))}

      {/* Chế độ chỉnh sửa */}
      {isEditing && (
        <AddressFormFields
          value={formData}
          onChange={handleChange}
          errors={errors}
          disabled={isSaving}
        />
      )}
    </div>
  )
}
