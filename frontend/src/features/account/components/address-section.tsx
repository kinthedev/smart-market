"use client"

import React, { useState, useMemo } from "react"
import { MapPin, Check, AlertCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Select } from "@/src/components/ui/select"
import { Field, FieldLabel } from "@/src/components/ui/field"
import { vietnamLocations } from "../data/locations"
import type { UserAddress } from "../types/account.types"
import { addressSchema } from "../schemas/account.schema"

interface AddressSectionProps {
  initialData: UserAddress
  onSave: (data: UserAddress) => Promise<boolean>
  onHasUnsavedChanges: (hasChanges: boolean) => void
}

export function AddressSection({
  initialData,
  onSave,
  onHasUnsavedChanges,
}: AddressSectionProps) {
  const [formData, setFormData] = useState<UserAddress>(initialData)
  const [savedData, setSavedData] = useState<UserAddress>(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Find currently selected province object
  const currentProvince = useMemo(() => {
    return vietnamLocations.find((p) => p.id === formData.provinceId) || null
  }, [formData.provinceId])

  // Find currently selected district object
  const currentDistrict = useMemo(() => {
    if (!currentProvince) return null
    return currentProvince.districts.find((d) => d.id === formData.districtId) || null
  }, [currentProvince, formData.districtId])

  // District options based on chosen province
  const districtOptions = useMemo(() => {
    return currentProvince ? currentProvince.districts : []
  }, [currentProvince])

  // Ward options based on chosen district
  const wardOptions = useMemo(() => {
    return currentDistrict ? currentDistrict.wards : []
  }, [currentDistrict])

  const checkChanges = (newData: UserAddress) => {
    const hasChanges = JSON.stringify(newData) !== JSON.stringify(savedData)
    onHasUnsavedChanges(hasChanges)
  }

  // Handle Province change -> reset district and ward
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvinceId = e.target.value
    const updated: UserAddress = {
      ...formData,
      provinceId: newProvinceId,
      districtId: "",
      ward: "",
    }
    setFormData(updated)
    checkChanges(updated)
    clearError("provinceId")
  }

  // Handle District change -> reset ward
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrictId = e.target.value
    const updated: UserAddress = {
      ...formData,
      districtId: newDistrictId,
      ward: "",
    }
    setFormData(updated)
    checkChanges(updated)
    clearError("districtId")
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updated: UserAddress = {
      ...formData,
      ward: e.target.value,
    }
    setFormData(updated)
    checkChanges(updated)
    clearError("ward")
  }

  const handleSpecificAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated: UserAddress = {
      ...formData,
      specificAddress: e.target.value,
    }
    setFormData(updated)
    checkChanges(updated)
    clearError("specificAddress")
  }

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
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
    const result = addressSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      setNotification({ type: "error", message: "Vui lòng nhập đầy đủ các thông tin địa chỉ." })
      return
    }

    setIsSaving(true)
    try {
      const success = await onSave(formData)
      if (success) {
        setSavedData(formData)
        setIsEditing(false)
        onHasUnsavedChanges(false)
        setNotification({ type: "success", message: "Cập nhật địa chỉ thành công!" })
      } else {
        setNotification({ type: "error", message: "Không thể lưu địa chỉ. Vui lòng thử lại." })
      }
    } catch {
      setNotification({ type: "error", message: "Đã xảy ra lỗi khi lưu địa chỉ." })
    } finally {
      setIsSaving(false)
    }
  }

  // Helper string representation
  const fullAddressString = useMemo(() => {
    const parts = [
      formData.specificAddress,
      formData.ward,
      currentDistrict?.name,
      currentProvince?.name,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "Chưa thiết lập địa chỉ"
  }, [formData.specificAddress, formData.ward, currentDistrict, currentProvince])

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Địa Chỉ Giao Hàng</h2>
          <p className="text-xs text-slate-500 sm:text-sm">Quản lý địa chỉ nhận hàng thuận tiện cho việc mua sắm</p>
        </div>
        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="mt-2 h-9 self-start rounded-sm border-orange-500 text-xs font-semibold text-orange-600 hover:bg-orange-50 sm:mt-0"
          >
            Chỉnh sửa
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

      {/* Overview display card when not editing */}
      {!isEditing && (
        <div className="rounded-lg border border-orange-100 bg-orange-50/40 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-orange-100 p-2 text-orange-600">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-800 uppercase tracking-wide">Địa chỉ mặc định hiện tại</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{fullAddressString}</p>
            </div>
          </div>
        </div>
      )}

      {/* Address selectors */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Tỉnh / Thành phố */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="mt-1">
              <Select
                value={formData.provinceId}
                disabled={!isEditing}
                onChange={handleProvinceChange}
                className="h-10 text-sm"
              >
                <option value="">-- Chọn Tỉnh / Thành phố --</option>
                {vietnamLocations.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
            {errors.provinceId && <p className="mt-1 text-xs text-red-500">{errors.provinceId}</p>}
          </Field>

          {/* Quận / Huyện */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Quận / Huyện <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="mt-1">
              <Select
                value={formData.districtId}
                disabled={!isEditing || !formData.provinceId}
                onChange={handleDistrictChange}
                className="h-10 text-sm"
              >
                <option value="">-- Chọn Quận / Huyện --</option>
                {districtOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </div>
            {errors.districtId && <p className="mt-1 text-xs text-red-500">{errors.districtId}</p>}
          </Field>

          {/* Phường / Xã */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Phường / Xã <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="mt-1">
              <Select
                value={formData.ward}
                disabled={!isEditing || !formData.districtId}
                onChange={handleWardChange}
                className="h-10 text-sm"
              >
                <option value="">-- Chọn Phường / Xã --</option>
                {wardOptions.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
            </div>
            {errors.ward && <p className="mt-1 text-xs text-red-500">{errors.ward}</p>}
          </Field>
        </div>

        {/* Địa chỉ cụ thể */}
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Địa chỉ cụ thể (Số nhà, tên đường, toà nhà...) <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="relative mt-1">
            <Input
              value={formData.specificAddress}
              disabled={!isEditing}
              onChange={handleSpecificAddressChange}
              placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Tòa nhà Bitexco"
              className="h-10 text-sm"
            />
            <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.specificAddress && <p className="mt-1 text-xs text-red-500">{errors.specificAddress}</p>}
        </Field>
      </div>
    </div>
  )
}
