"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  AlertTriangle,
  Users,
} from "lucide-react"
import { SiteHeader } from "@/src/components/site-header"
import { SiteFooter } from "@/src/components/site-footer"
import { PersonalInfoSection } from "./personal-info-section"
import { AddressSection } from "./address-section"
import { ReceiverInfoSection } from "./receiver-info-section"
import { SecuritySection } from "./security-section"
import { useAuth } from "@/src/features/auth/hooks/use-auth"
import { AccountApiService } from "../api/account.service"
import type { AccountData, ReceiverAddress, UserProfile } from "../types/account.types"

type ActiveTab = "profile" | "address" | "receivers" | "security"

const initialMockAccountData: AccountData = {
  profile: {
    avatarUrl: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Nam",
  },
  security: {
    username: "",
    passwordChangedAt: "",
  },
}

export function AccountManagementView() {
  const router = useRouter()
  const { user: authUser, logout, isLoading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<ActiveTab>("profile")
  const [accountData, setAccountData] = useState<AccountData>(initialMockAccountData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false)
  const [pendingTabChange, setPendingTabChange] = useState<ActiveTab | null>(null)

  // Sổ địa chỉ người nhận (dữ liệu thật từ database)
  const [addresses, setAddresses] = useState<ReceiverAddress[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [addressError, setAddressError] = useState("")

  const loadAddresses = async () => {
    setIsLoadingAddresses(true)
    setAddressError("")
    try {
      const data = await AccountApiService.getAddresses()
      setAddresses(data)
    } catch (error: any) {
      setAddressError(error?.message || "Không thể tải sổ địa chỉ người nhận.")
      setAddresses([])
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  useEffect(() => {
    if (!authUser) {
      setAddresses([])
      return
    }
    void loadAddresses()
  }, [authUser?.id])

  const defaultAddress = addresses.find((item) => item.isDefault) ?? null
  const suggestedPhone = (authUser as any)?.phone || ""

  // Sync authUser into profile data if logged in
  useEffect(() => {
    if (authUser) {
      setAccountData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: authUser.name || prev.profile.fullName,
          email: authUser.email || prev.profile.email,
          avatarUrl: authUser.image || prev.profile.avatarUrl,
        },
        security: {
          ...prev.security,
          username: authUser.email ? authUser.email.split("@")[0] : prev.security.username,
        },
      }))
    }
  }, [authUser])

  // Warn user when closing tab / refreshing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleTabSwitch = (newTab: ActiveTab) => {
    if (newTab === activeTab) return
    if (hasUnsavedChanges) {
      setPendingTabChange(newTab)
      setShowExitConfirmModal(true)
    } else {
      setActiveTab(newTab)
    }
  }

  const handleConfirmLeave = () => {
    setHasUnsavedChanges(false)
    setShowExitConfirmModal(false)
    if (pendingTabChange) {
      setActiveTab(pendingTabChange)
      setPendingTabChange(null)
    }
  }

  // Save handler for Personal Info
  const handleSaveProfile = async (newProfile: UserProfile): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    setAccountData((prev) => ({ ...prev, profile: newProfile }))
    setHasUnsavedChanges(false)
    return true
  }

  // Password change handler
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (data.currentPassword !== "123456" && data.currentPassword !== "password123" && data.currentPassword.length < 6) {
      return false
    }
    setHasUnsavedChanges(false)
    return true
  }

  const navItems = [
    {
      id: "profile" as const,
      label: "Thông tin cá nhân",
      description: "Họ tên, ảnh đại diện, email & SĐT",
      icon: User,
    },
    {
      id: "address" as const,
      label: "Địa chỉ cá nhân",
      description: "Địa chỉ giao hàng mặc định",
      icon: MapPin,
    },
    {
      id: "receivers" as const,
      label: "Thông tin người nhận",
      description: "Lưu nhiều người nhận để chọn khi thanh toán",
      icon: Users,
    },
    {
      id: "security" as const,
      label: "Bảo mật tài khoản",
      description: "Tên đăng nhập & đổi mật khẩu",
      icon: ShieldCheck,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground">
      {/* Site Header */}
      <SiteHeader
        user={
          authUser
            ? {
                name: authUser.name || authUser.email || "Khách hàng",
                email: authUser.email,
                avatarUrl: authUser.image || accountData.profile.avatarUrl || undefined,
                isAdmin: authUser.isAdmin,
              }
            : null
        }
        onLogout={() => {
          if (hasUnsavedChanges) {
            if (confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đăng xuất?")) {
              logout()
            }
          } else {
            logout()
          }
        }}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
        {/* Breadcrumb / Back button */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 sm:text-sm"
          >
            <ArrowLeft className="size-4" />
            <span>Quay lại trang mua sắm</span>
          </Link>
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              <AlertTriangle className="size-3.5" />
              Có thay đổi chưa lưu
            </span>
          )}
        </div>

        {/* Page Title & Description */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Tài Khoản Khách Hàng
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Quản lý thông tin cá nhân, sổ địa chỉ và bảo mật đăng nhập cho trải nghiệm mua sắm tốt nhất.
          </p>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="mb-6 flex overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-xs [scrollbar-width:none] md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabSwitch(item.id)}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-orange-500 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-orange-600"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column: Sidebar Menu */}
          <aside className="hidden md:col-span-4 md:block lg:col-span-3">
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
              {/* User Mini Profile Brief */}
              <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-orange-200 bg-orange-100">
                    {accountData.profile.avatarUrl ? (
                      <img
                        src={accountData.profile.avatarUrl}
                        alt="Avatar"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-orange-600">
                        <User className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {accountData.profile.fullName || authUser?.name || "Tài khoản người dùng"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {accountData.profile.email || authUser?.email || "Chưa cập nhật email"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="p-2 space-y-1" aria-label="Menu tài khoản">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabSwitch(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-all ${
                        active
                          ? "bg-orange-50 text-orange-600 font-bold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-orange-600 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-md p-1.5 ${
                            active ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <div className="text-sm">{item.label}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`size-4 transition-transform ${
                          active ? "text-orange-500 translate-x-0.5" : "text-slate-300"
                        }`}
                      />
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Right Column: Content Card */}
          <section className="md:col-span-8 lg:col-span-9">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-7">
              {addressError && (activeTab === "address" || activeTab === "receivers") && (
                <div className="mb-4 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              {activeTab === "profile" && (
                <PersonalInfoSection
                  initialData={accountData.profile}
                  onSave={handleSaveProfile}
                  onHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}

              {activeTab === "address" && (
                <AddressSection
                  defaultAddress={defaultAddress}
                  isLoading={isLoadingAddresses}
                  suggestedName={authUser?.name || ""}
                  suggestedPhone={suggestedPhone}
                  onSaved={loadAddresses}
                  onHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}

              {activeTab === "receivers" && (
                <ReceiverInfoSection
                  addresses={addresses}
                  isLoading={isLoadingAddresses}
                  onChanged={loadAddresses}
                  onHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}

              {activeTab === "security" && (
                <SecuritySection
                  securityData={accountData.security}
                  onChangePassword={handleChangePassword}
                  onHasUnsavedChanges={setHasUnsavedChanges}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Unsaved Changes Confirmation Dialog */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="rounded-full bg-amber-100 p-2">
                <AlertTriangle className="size-6 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Thay đổi chưa lưu</h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Bạn đang có các thông tin đã chỉnh sửa nhưng chưa bấm <strong>Lưu thay đổi</strong>. Bạn có chắc chắn muốn rời đi và hủy bỏ các thay đổi này?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false)
                  setPendingTabChange(null)
                }}
                className="rounded-sm border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ở lại trang
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="rounded-sm bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Rời đi & Hủy thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
