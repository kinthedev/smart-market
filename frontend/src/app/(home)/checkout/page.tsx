"use client"

import * as React from "react"
import { SiteHeader } from "@/src/components/site-header"
import { SiteFooter } from "@/src/components/site-footer"
import { useAuth } from "@/src/features/auth/hooks/use-auth"
import { CheckoutView } from "@/src/features/orders/components/checkout-view"
import type { User } from "@/src/data-seed/shop-data"

export default function CheckoutPage() {
  const { user: authUser, logout } = useAuth()

  const currentUser: User | null = React.useMemo(() => {
    if (!authUser) return null
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    }
  }, [authUser])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader user={currentUser} onLogout={() => logout()} />

      <main className="min-h-[calc(100vh-200px)]">
        <CheckoutView />
      </main>

      <SiteFooter />
    </div>
  )
}
