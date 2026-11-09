'use client'

import type { Product as CatalogProduct } from '../types/product.types'
import type { Product, User } from '@/src/data-seed/shop-data'
import { CategoryGrid } from './category-grid'
import { FlashSale } from './flash-sale'
import { HeroSection } from './hero-section'
import { ProductGrid } from './product-grid'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'

export type ProductHomePageProps = {
    user?: User | null
    onLogout?: () => void
    onAddToCart?: (product: Product | CatalogProduct) => void
    onProductClick?: (product: Product | CatalogProduct) => void
}

export function ProductHomePage({
    user = null,
    onLogout,
    onAddToCart,
    onProductClick,
}: ProductHomePageProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SiteHeader user={user} onLogout={onLogout} />
            <main>
                <HeroSection />
                <CategoryGrid />
                <FlashSale onAddToCart={onAddToCart} onProductClick={onProductClick} />
                <ProductGrid onAddToCart={onAddToCart} onProductClick={onProductClick} />
            </main>
            <SiteFooter />
        </div>
    )
}
