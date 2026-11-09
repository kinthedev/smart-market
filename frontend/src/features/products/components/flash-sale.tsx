'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, LoaderCircle, Zap } from 'lucide-react'
import { ProductApiService } from '../api/product.service'
import type { Product } from '../types/product.types'
import { ProductCard, type ProductCardItem } from './product-card'

const INITIAL_SECONDS = 2 * 3600 + 45 * 60 + 30

function CountdownTimer() {
    const [seconds, setSeconds] = useState(INITIAL_SECONDS)

    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : INITIAL_SECONDS)), 1000)
        return () => clearInterval(id)
    }, [])

    const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((n) =>
        String(n).padStart(2, '0')
    )

    return (
        <div className="flex items-center gap-1" role="timer" aria-label="Thời gian còn lại của Flash Sale">
            <span className="mr-1.5 hidden text-sm font-medium text-neutral-500 sm:inline">KẾT THÚC TRONG</span>
            {parts.map((part, i) => (
                <span key={i} className="flex items-center gap-1">
                    <span className="flex h-7 min-w-7 items-center justify-center rounded-sm bg-neutral-900 px-1 font-mono text-sm font-bold tabular-nums text-white sm:h-8 sm:min-w-8 sm:text-base">
                        {part}
                    </span>
                    {i < parts.length - 1 && <span className="font-bold text-neutral-900">:</span>}
                </span>
            ))}
        </div>
    )
}

export function FlashSale({
    onAddToCart,
    onProductClick,
}: {
    onAddToCart?: (product: ProductCardItem) => void
    onProductClick?: (product: ProductCardItem) => void
}) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [retryKey, setRetryKey] = useState(0)

    useEffect(() => {
        let isCurrent = true
        setIsLoading(true)
        setError(null)

        ProductApiService.getProducts({
            page: 1,
            limit: 12,
            status: 'ACTIVE',
            saleType: 'flash-sale',
            sortBy: 'newest',
        })
            .then((result) => {
                if (isCurrent) setProducts(result.items)
            })
            .catch((loadError: unknown) => {
                if (isCurrent) {
                    setError(loadError instanceof Error ? loadError.message : 'Không thể tải sản phẩm Flash Sale')
                }
            })
            .finally(() => {
                if (isCurrent) setIsLoading(false)
            })

        return () => {
            isCurrent = false
        }
    }, [retryKey])

    if (isLoading) {
        return (
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-6 text-sm text-neutral-500">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Đang tải Flash Sale...
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-4 text-sm text-red-600">
                <span>{error}</span>
                <button type="button" onClick={() => setRetryKey((current) => current + 1)} className="font-medium underline">
                    Thử lại
                </button>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <section id="flash-sale" aria-labelledby="flash-sale-heading" className="mx-auto max-w-7xl scroll-mt-4 px-4 pt-3">
            <div className="bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <h2
                            id="flash-sale-heading"
                            className="flex items-center gap-1 text-xl font-black uppercase italic tracking-tight text-primary sm:text-2xl"
                        >
                            <Zap className="size-6 fill-yellow-400 text-primary" aria-hidden="true" />
                            Flash Sale
                        </h2>
                        <CountdownTimer />
                    </div>
                    <a href="#" className="flex items-center text-sm font-medium text-primary hover:underline">
                        Xem tất cả <ChevronRight className="size-4" aria-hidden="true" />
                    </a>
                </div>

                <div className="relative p-2 sm:p-3">
                    <ul
                        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none]"
                    >
                        {products.map((product) => (
                            <li key={product.id} className="w-40 shrink-0 snap-start sm:w-44 lg:w-48">
                                <ProductCard product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </section>
    )
}
