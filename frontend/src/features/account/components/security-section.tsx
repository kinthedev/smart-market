"use client"

import React, { useState, useMemo } from "react"
import { ShieldCheck, Eye, EyeOff, Lock, UserCheck, Check, AlertCircle, KeyRound } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Field, FieldLabel } from "@/src/components/ui/field"
import type { AccountSecurity } from "../types/account.types"
import { passwordChangeSchema } from "../schemas/account.schema"

interface SecuritySectionProps {
  securityData: AccountSecurity
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<boolean>
  onHasUnsavedChanges: (hasChanges: boolean) => void
}

export function SecuritySection({
  securityData,
  onChangePassword,
  onHasUnsavedChanges,
}: SecuritySectionProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Password strength calculation
  const strength = useMemo(() => {
    const pwd = formData.newPassword
    if (!pwd) return { score: 0, label: "", color: "" }

    let score = 0
    if (pwd.length >= 8) score += 1
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1
    if (/\d/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

    switch (score) {
      case 1:
        return { score: 25, label: "Yếu", color: "bg-red-500 text-red-500" }
      case 2:
        return { score: 50, label: "Trung bình", color: "bg-amber-500 text-amber-500" }
      case 3:
        return { score: 75, label: "Khá mạnh", color: "bg-blue-500 text-blue-500" }
      case 4:
        return { score: 100, label: "Rất mạnh", color: "bg-emerald-500 text-emerald-500" }
      default:
        return { score: 15, label: "Rất yếu", color: "bg-red-400 text-red-400" }
    }
  }, [formData.newPassword])

  const handleChange = (field: keyof typeof formData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    const hasAny = Boolean(updated.currentPassword || updated.newPassword || updated.confirmPassword)
    onHasUnsavedChanges(hasAny)

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
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    setNotification(null)
    onHasUnsavedChanges(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotification(null)

    const result = passwordChangeSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      setNotification({ type: "error", message: "Vui lòng hoàn tất đúng định dạng mật khẩu." })
      return
    }

    setIsSubmitting(true)
    try {
      const success = await onChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })

      if (success) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        onHasUnsavedChanges(false)
        setNotification({ type: "success", message: "Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo vệ an toàn." })
      } else {
        setNotification({ type: "error", message: "Mật khẩu hiện tại không chính xác. Vui lòng thử lại." })
      }
    } catch {
      setNotification({ type: "error", message: "Đã xảy ra lỗi trong khi đổi mật khẩu." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Bảo Mật Tài Khoản</h2>
        <p className="text-xs text-slate-500 sm:text-sm">Quản lý tên đăng nhập và thay đổi mật khẩu định kỳ</p>
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

      {/* Group 1: Tên đăng nhập (Chỉ xem) */}
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-200 p-2 text-slate-700">
              <UserCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tên đăng nhập hệ thống</p>
              <p className="text-base font-bold text-slate-900">{securityData.username}</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
            Cố định (Chỉ xem)
          </span>
        </div>
      </div>

      {/* Group 2: Form Đổi mật khẩu */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound className="size-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900">Thiết lập mật khẩu mới</h3>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Mật khẩu hiện tại */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative mt-1">
              <Input
                type={showCurrent ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
                placeholder="Nhập mật khẩu bạn đang dùng"
                className="h-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Ẩn" : "Hiện"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>}
          </Field>

          {/* Mật khẩu mới */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Mật khẩu mới <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative mt-1">
              <Input
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, thường & số"
                className="h-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Ẩn" : "Hiện"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}

            {/* Password strength indicator */}
            {formData.newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                  <span className={`font-semibold ${strength.color.split(" ")[1]}`}>{strength.label}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color.split(" ")[0]}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </Field>

          {/* Nhập lại mật khẩu mới */}
          <Field>
            <FieldLabel className="text-xs font-semibold text-slate-700">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </FieldLabel>
            <div className="relative mt-1">
              <Input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                placeholder="Xác nhận lại mật khẩu mới vừa nhập"
                className="h-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Ẩn" : "Hiện"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </Field>

          {/* Action buttons */}
          <div className="flex flex-col-reverse gap-2 pt-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword)}
              onClick={handleCancel}
              className="h-10 w-full rounded-sm border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="h-10 w-full rounded-sm bg-orange-500 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-600 sm:w-auto"
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu mật khẩu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
