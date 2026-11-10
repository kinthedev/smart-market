"use client"

import React, { useMemo } from "react"
import { MapPin, Phone, User } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Select } from "@/src/components/ui/select"
import { Field, FieldLabel } from "@/src/components/ui/field"
import { vietnamLocations } from "../data/locations"
import type { AddressFormValue } from "../types/account.types"

interface AddressFormFieldsProps {
  value: AddressFormValue
  onChange: (next: AddressFormValue) => void
  disabled?: boolean
  errors?: Record<string, string>
}

/**
 * Bộ trường dùng chung cho địa chỉ cá nhân & thông tin người nhận.
 * Tự xử lý chọn Tỉnh → reset Quận/Phường, chọn Quận → reset Phường.
 */
export function AddressFormFields({
  value,
  onChange,
  disabled = false,
  errors = {},
}: AddressFormFieldsProps) {
  const currentProvince = useMemo(
    () => vietnamLocations.find((p) => p.id === value.provinceId) || null,
    [value.provinceId]
  )

  const currentDistrict = useMemo(() => {
    if (!currentProvince) return null
    return currentProvince.districts.find((d) => d.id === value.districtId) || null
  }, [currentProvince, value.districtId])

  const districtOptions = currentProvince?.districts ?? []
  const wardOptions = currentDistrict?.wards ?? []

  const update = (patch: Partial<AddressFormValue>) => {
    onChange({ ...value, ...patch })
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    update({ provinceId: e.target.value, districtId: "", ward: "" })
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    update({ districtId: e.target.value, ward: "" })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Họ và tên người nhận <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="relative mt-1">
            <Input
              value={value.receiverName}
              disabled={disabled}
              onChange={(e) => update({ receiverName: e.target.value })}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="h-10 pr-9 text-sm"
            />
            <User className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.receiverName && (
            <p className="mt-1 text-xs text-red-500">{errors.receiverName}</p>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Số điện thoại <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="relative mt-1">
            <Input
              type="tel"
              value={value.receiverPhone}
              disabled={disabled}
              onChange={(e) => update({ receiverPhone: e.target.value })}
              placeholder="Ví dụ: 0987654321"
              className="h-10 pr-9 text-sm"
            />
            <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.receiverPhone && (
            <p className="mt-1 text-xs text-red-500">{errors.receiverPhone}</p>
          )}
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="mt-1">
            <Select
              value={value.provinceId}
              disabled={disabled}
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
          {errors.provinceId && (
            <p className="mt-1 text-xs text-red-500">{errors.provinceId}</p>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Quận / Huyện <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="mt-1">
            <Select
              value={value.districtId}
              disabled={disabled || !value.provinceId}
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
          {errors.districtId && (
            <p className="mt-1 text-xs text-red-500">{errors.districtId}</p>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-xs font-semibold text-slate-700">
            Phường / Xã <span className="text-red-500">*</span>
          </FieldLabel>
          <div className="mt-1">
            <Select
              value={value.ward}
              disabled={disabled || !value.districtId}
              onChange={(e) => update({ ward: e.target.value })}
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

      <Field>
        <FieldLabel className="text-xs font-semibold text-slate-700">
          Địa chỉ cụ thể (Số nhà, tên đường, toà nhà...){" "}
          <span className="text-red-500">*</span>
        </FieldLabel>
        <div className="relative mt-1">
          <Input
            value={value.addressDetail}
            disabled={disabled}
            onChange={(e) => update({ addressDetail: e.target.value })}
            placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Tòa nhà Bitexco"
            className="h-10 pr-9 text-sm"
          />
          <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        </div>
        {errors.addressDetail && (
          <p className="mt-1 text-xs text-red-500">{errors.addressDetail}</p>
        )}
      </Field>
    </div>
  )
}

/** Ghép địa chỉ đầy đủ để hiển thị / gửi đơn hàng. */
export function formatFullAddress(input: {
  addressDetail: string
  ward: string
  district: string
  province: string
}) {
  return [input.addressDetail, input.ward, input.district, input.province]
    .filter(Boolean)
    .join(", ")
}
