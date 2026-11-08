'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductHomePage } from '@/src/features/products/components/product-home-page'
import { useAuth } from '@/src/features/auth/hooks/use-auth'
import type { Product, User } from '@/src/data-seed/shop-data'

export default function Page() {
  const router = useRouter()
  const { user: authUser, logout, isLoading } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  // Chuyển đổi dữ liệu user từ Better Auth sang format User cho header
  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null
    return {
      name: authUser.name || authUser.email || 'Người dùng',
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    }
  }, [authUser])

  const handleProductClick = (_product: Product) => {
    // Nếu chưa đăng nhập, chuyển hướng người dùng về trang đăng nhập
    if (!isLoading && !authUser) {
      router.push('/login')
      return
    }
  }

  const handleAddToCart = (product: Product) => {
    if (!isLoading && !authUser) {
      router.push('/login')
      return
    }
    setCartCount((count) => count + 1)
  }

  return (
    <ProductHomePage
      user={currentUser}
      cartCount={cartCount}
      onLogout={() => logout()}
      onAddToCart={handleAddToCart}
      onProductClick={handleProductClick}
    />
  )
}
