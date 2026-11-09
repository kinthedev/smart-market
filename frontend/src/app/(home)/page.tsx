'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProductHomePage } from '@/src/features/products/components/product-home-page'
import { useAuth } from '@/src/features/auth/hooks/use-auth'
import { useCart } from '@/src/features/cart/hooks/use-cart'
import { buildCartItem } from '@/src/features/cart/utils/cart-item'
import type { Product, User } from '@/src/data-seed/shop-data'
import type { Product as CatalogProduct } from '@/src/features/products/types/product.types'

export default function Page() {
  const router = useRouter()
  const { user: authUser, logout, isLoading } = useAuth()
  const { addItem } = useCart()

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

  const handleAddToCart = (product: Product | CatalogProduct) => {
    if (!isLoading && !authUser) {
      router.push('/login')
      return
    }
    addItem(buildCartItem(product))
  }

  return (
    <ProductHomePage
      user={currentUser}
      onLogout={() => logout()}
      onAddToCart={handleAddToCart}
    />
  )
}
