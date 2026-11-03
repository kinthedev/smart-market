'use client'

import { useState } from 'react'
import { ProductHomePage } from '@/src/features/products/components/product-home-page'
import type { User } from '@/src/data-seed/shop-data'

const demoUser: User = { name: 'Minh Anh', email: 'minhanh@example.com' }

export default function Page() {
  const [user, setUser] = useState<User | null>(demoUser)
  const [cartCount, setCartCount] = useState(2)

  return (
    <ProductHomePage
      user={user}
      cartCount={cartCount}
      onLogout={() => setUser(null)}
      onAddToCart={() => setCartCount((count) => count + 1)}
    />
  )
}
