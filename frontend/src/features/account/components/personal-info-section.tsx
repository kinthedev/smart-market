"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Mail, Phone, Calendar, User, Check, AlertCircle, ShieldAlert, KeyRound } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Field, FieldLabel } from "@/src/components/ui/field"
import type { UserProfile } from "../types/account.types"
import { profileSchema } from "../schemas/account.schema"

interface PersonalInfoSectionProps {
  initialData: UserProfile
  onSave: (data: UserProfile) => Promise<boolean>
  onHasUnsavedChanges: (hasChanges: boolean) => void
}

export function PersonalInfoSection({
  initialData,
  onSave,
  onHasUnsavedChanges,
}: PersonalInfoSectionProps) {
  const [formData, setFormData] = useState<UserProfile>(initialData)
  const [savedData, setSavedData] = useState<UserProfile>(initialData)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Verification modal states
  const [verifyingEmail, setVerifyingEmail] = useState(false)
  const [emailVerificationCode, setEmailVerificationCode] = useState("")
  const [verifyingPhone, setVerifyingPhone] = useState(false)
  const [phoneOtp, setPhoneOtp] = useState("")
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Track unsaved changes
  const checkChanges = (newData: UserProfile) => {
    const hasChanges = JSON.stringify(newData) !== JSON.stringify(savedData)
    onHasUnsavedChanges(hasChanges)
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    checkChanges(updated)
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
    if (notification) setNotification(null)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNotification({ type: "error", message: "Kích thước ảnh tối đa là 2MB" })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Url = reader.result as string
        const updated = { ...formData, avatarUrl: base64Url }
        setFormData(updated)
        checkChanges(updated)
        setIsEditing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    setFormData(savedData)
    setErrors({})
    setIsEditing(false)
    setNotification(null)
    onHasUnsavedChanges(false)
  }

  const handlePreSave = async () => {
    setNotification(null)
    const result = profileSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      setNotification({ type: "error", message: "Vui lòng kiểm tra lại các thông tin chưa hợp lệ." })
      return
    }

    // Check if email changed
    if (formData.email !== savedData.email && !pendingEmail) {
      setPendingEmail(formData.email)
      setVerifyingEmail(true)
      return
    }

    // Check if phone changed
    if (formData.phone !== savedData.phone && !pendingPhone) {
      setPendingPhone(formData.phone)
      setVerifyingPhone(true)
      return
    }

    await executeSave()
  }

  const executeSave = async () => {
    setIsSaving(true)
    try {
      const success = await onSave(formData)
      if (success) {
        setSavedData(formData)
        setIsEditing(false)
        onHasUnsavedChanges(false)
        setNotification({ type: "success", message: "Cập nhật thông tin cá nhân thành công!" })
      } else {
        setNotification({ type: "error", message: "Không thể lưu thông tin. Vui lòng thử lại." })
      }
    } catch {
      setNotification({ type: "error", message: "Đã có lỗi xảy ra trong quá trình lưu." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerifyEmail = () => {
    if (emailVerificationCode.trim() === "123456" || emailVerificationCode.trim().length === 6) {
      setVerifyingEmail(false)
      setEmailVerificationCode("")
      // Next check if phone also changed
      if (formData.phone !== savedData.phone && !pendingPhone) {
        setPendingPhone(formData.phone)
        setVerifyingPhone(true)
      } else {
        executeSave()
      }
    } else {
      alert("Mã xác thực email không đúng (Thử nhập 123456)")
    }
  }

  const handleVerifyPhone = () => {
    if (phoneOtp.trim() === "123456" || phoneOtp.trim().length === 6) {
      setVerifyingPhone(false)
      setPhoneOtp("")
      executeSave()
    } else {
      alert("Mã OTP không đúng (Thử nhập 123456)")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Hồ Sơ Của Tôi</h2>
          <p className="text-xs text-slate-500 sm:text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
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
              onClick={handlePreSave}
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

      {/* Main Form + Avatar */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Form: 2 cols */}
        <div className="space-y-4 md:col-span-2">
          {/* Họ và tên */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Họ và tên <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative mt-1">
              <Input
                value={formData.fullName}
                disabled={!isEditing}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className="h-10 text-sm"
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </Field>

          {/* Email */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </FieldLabel>
              {formData.email !== savedData.email && isEditing && (
                <span className="text-[11px] text-orange-600 font-medium">Cần xác minh qua email khi lưu</span>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                type="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="vidu@example.com"
                className="h-10 text-sm"
              />
              <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </Field>

          {/* Số điện thoại */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel className="text-xs font-semibold text-slate-700">
                Số điện thoại <span className="text-red-500">*</span>
              </FieldLabel>
              {formData.phone !== savedData.phone && isEditing && (
                <span className="text-[11px] text-orange-600 font-medium">Cần mã OTP khi lưu</span>
              )}
            </div>
            <div className="relative mt-1">
              <Input
                type="tel"
                value={formData.phone}
                disabled={!isEditing}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0912345678"
                className="h-10 text-sm"
              />
              <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </Field>

          {/* Giới tính */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">Giới tính</FieldLabel>
            <div className="mt-2 flex items-center gap-6">
              {(["Nam", "Nữ", "Khác"] as const).map((genderOption) => (
                <label
                  key={genderOption}
                  className={`flex items-center gap-2 text-sm ${
                    isEditing ? "cursor-pointer text-slate-800" : "cursor-not-allowed text-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    disabled={!isEditing}
                    checked={formData.gender === genderOption}
                    onChange={() => handleChange("gender", genderOption)}
                    className="size-4 accent-orange-500"
                  />
                  <span>{genderOption}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
          </Field>

          {/* Ngày sinh */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Ngày sinh <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative mt-1">
              <Input
                type="date"
                value={formData.dateOfBirth}
                disabled={!isEditing}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className="h-10 text-sm"
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>}
          </Field>
        </div>

        {/* Right Form: Avatar Upload */}
        <div className="flex flex-col items-center justify-start border-t border-slate-100 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-2">
          <div className="relative size-32 overflow-hidden rounded-full border-2 border-orange-200 bg-slate-100 shadow-inner sm:size-36">
            {formData.avatarUrl ? (
              <Image
                src={formData.avatarUrl}
                alt="Ảnh đại diện"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-orange-100 text-orange-600">
                <User className="size-16" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex h-9 items-center gap-1.5 rounded-sm border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Camera className="size-3.5 text-orange-500" />
            Chọn ảnh mới
          </Button>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            Dung lượng file tối đa 2 MB<br />Định dạng: .JPEG, .PNG, .WEBP
          </p>
        </div>
      </div>

      {/* Email Verification Modal */}
      {verifyingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-orange-600">
              <Mail className="size-5" />
              <h3 className="text-base font-bold text-slate-900">Xác thực thay đổi Email</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Mã xác minh đã được gửi đến email <strong>{formData.email}</strong>. Vui lòng nhập mã để hoàn tất.
            </p>
            <div className="mt-4">
              <Input
                placeholder="Nhập 6 số xác thực (vd: 123456)"
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center font-mono text-base tracking-widest"
              />
              <p className="mt-1 text-[11px] text-slate-400">Gợi ý kiểm thử: Nhập 123456</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVerifyingEmail(false)
                  setPendingEmail(null)
                }}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleVerifyEmail}
              >
                Xác thực
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phone OTP Modal */}
      {verifyingPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-orange-600">
              <Phone className="size-5" />
              <h3 className="text-base font-bold text-slate-900">Xác thực OTP số điện thoại</h3>
            </div>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm">
              Mã OTP gồm 6 chữ số đã được gửi qua tin nhắn SMS tới số <strong>{formData.phone}</strong>.
            </p>
            <div className="mt-4">
              <Input
                placeholder="Nhập mã OTP (vd: 123456)"
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                maxLength={6}
                className="text-center font-mono text-base tracking-widest"
              />
              <p className="mt-1 text-[11px] text-slate-400">Gợi ý kiểm thử: Nhập 123456</p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVerifyingPhone(false)
                  setPendingPhone(null)
                }}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleVerifyPhone}
              >
                Xác nhận OTP
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
