'use client'

import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import { cn } from 'cn'
import type { Product } from '@/src/data-seed/shop-data'
import { ProductCard } from './product-card'

const tabs = [
    { id: 'for-you', label: 'Gợi Ý Hôm Nay' },
    { id: 'best-seller', label: 'Bán Chạy' },
    { id: 'newest', label: 'Hàng Mới' },
    { id: 'price-asc', label: 'Giá Thấp - Cao' },
] as const

type TabId = (typeof tabs)[number]['id']

const PAGE_SIZE = 12

type ProductGridProps = {
    products: Product[]
    query?: string
    onAddToCart?: (product: Product) => void
    onProductClick?: (product: Product) => void
}

export function ProductGrid({ products, query, onAddToCart, onProductClick }: ProductGridProps) {
    const [activeTab, setActiveTab] = useState<TabId>('for-you')
    const [visible, setVisible] = useState(PAGE_SIZE)

    const sorted = useMemo(() => {
        const list = [...products]
        switch (activeTab) {
            case 'best-seller':
                return list.sort((a, b) => b.sold - a.sold)
            case 'newest':
                return list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || b.id - a.id)
            case 'price-asc':
                return list.sort((a, b) => a.price - b.price)
            default:
                return list
        }
    }, [products, activeTab])

    const shown = sorted.slice(0, visible)

    return (
        <section id="products" aria-labelledby="products-heading" className="mx-auto max-w-7xl scroll-mt-2 px-4 pt-2">
            <div className="sticky top-0 z-20 -mx-4 mb-3 bg-background px-4 pb-1 pt-1 sm:static sm:mx-0 sm:p-0">
                <h2 id="products-heading" className="sr-only">
                    Gợi ý hôm nay
                </h2>
                <div
                    role="tablist"
                    aria-label="Sắp xếp sản phẩm"
                    className="flex overflow-x-auto bg-white shadow-sm [scrollbar-width:none]"
                >
                    {tabs.map((tab) => {
                        const active = tab.id === activeTab
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                type="button"
                                aria-selected={active}
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    setVisible(PAGE_SIZE)
                                }}
                                className={cn(
                                    'relative flex-1 whitespace-nowrap border-b-4 border-transparent px-3 py-2.5 text-sm font-bold uppercase transition-colors sm:text-[15px]',
                                    active ? 'border-primary text-primary' : 'text-neutral-600 hover:text-primary'
                                )}
                            >
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {query ? (
                <p className="mb-3 text-sm text-neutral-600">
                    Kết quả cho <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>: {sorted.length} sản phẩm
                </p>
            ) : null}

            {sorted.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-sm bg-white py-16 text-center shadow-sm">
                    <SearchX className="size-10 text-neutral-300" aria-hidden="true" />
                    <p className="font-medium text-neutral-800">Không tìm thấy sản phẩm phù hợp</p>
                    <p className="text-sm text-neutral-500">Hãy thử từ khóa khác hoặc chọn một gợi ý ở thanh tìm kiếm.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {shown.map((product) => (
                        <li key={product.id}>
                            <ProductCard product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                        </li>
                    ))}
                </ul>
            )}

            {visible < sorted.length && (
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="h-11 w-full max-w-72 rounded-sm border border-[#ee4d2d] bg-white text-sm font-normal uppercase text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                        Xem thêm sản phẩm
                    </button>
                </div>
            )}
        </section>
    )
}
