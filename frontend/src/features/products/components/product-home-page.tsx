'use client'

import { useMemo, useState } from 'react'
import { products as allProducts, type Product, type User } from '@/src/data-seed/shop-data'
import { CategoryGrid } from './category-grid'
import { FlashSale } from './flash-sale'
import { HeroSection } from './hero-section'
import { ProductGrid } from './product-grid'
import { SiteFooter } from '../../../components/site-footer'
import { SiteHeader } from '../../../components/site-header'

export type ProductHomePageProps = {
    user?: User | null
    cartCount?: number
    onLogout?: () => void
    onAddToCart?: (product: Product) => void
    onSearch?: (query: string) => void
}

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .toLowerCase()
        .trim()

export function ProductHomePage({
    user = null,
    cartCount = 0,
    onLogout,
    onAddToCart,
    onSearch,
}: ProductHomePageProps) {
    const [query, setQuery] = useState('')

    const handleSearch = (value: string) => {
        onSearch?.(value)

        if (normalize(value) === 'flash sale') {
            setQuery('')
            document.getElementById('flash-sale')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }

        setQuery(value)
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const filtered = useMemo(() => {
        const q = normalize(query)
        return q ? allProducts.filter((p) => normalize(p.name).includes(q)) : allProducts
    }, [query])

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SiteHeader user={user} cartCount={cartCount} onLogout={onLogout} onSearch={handleSearch} />
            <main>
                <HeroSection />
                <CategoryGrid />
                <FlashSale onAddToCart={onAddToCart} />
                <ProductGrid products={filtered} query={query} onAddToCart={onAddToCart} />
            </main>
            <SiteFooter />
        </div>
    )
}
