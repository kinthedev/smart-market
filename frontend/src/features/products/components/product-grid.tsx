'use client'

import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, SearchX } from 'lucide-react'
import { ProductApiService } from '../api/product.service'
import type { Product as CatalogProduct } from '../types/product.types'
import { ProductCard } from './product-card'

const PAGE_SIZE = 12

type ProductGridProps = {
    query?: string
    categoryId?: string
    title?: string
    onAddToCart?: (product: CatalogProduct) => void
    onProductClick?: (product: CatalogProduct) => void
}

export function ProductGrid({ query, categoryId, title, onAddToCart, onProductClick }: ProductGridProps) {
    const [products, setProducts] = useState<CatalogProduct[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [retryKey, setRetryKey] = useState(0)
    const requestId = useRef(0)

    useEffect(() => {
        const currentRequestId = ++requestId.current
        setProducts([])
        setPage(1)
        setTotal(0)
        setError(null)
        setIsLoading(true)
        setIsLoadingMore(false)

        ProductApiService.getProducts({
            page: 1,
            limit: PAGE_SIZE,
            search: query?.trim() || undefined,
            categoryId: categoryId || undefined,
            status: 'ACTIVE',
            sortBy: 'newest',
        })
            .then((result) => {
                if (requestId.current !== currentRequestId) return
                setProducts(result.items)
                setTotal(result.pagination.total)
            })
            .catch((loadError: unknown) => {
                if (requestId.current !== currentRequestId) return
                setError(loadError instanceof Error ? loadError.message : 'Không thể tải danh sách sản phẩm')
            })
            .finally(() => {
                if (requestId.current === currentRequestId) setIsLoading(false)
            })

        return () => {
            if (requestId.current === currentRequestId) requestId.current += 1
        }
    }, [query, categoryId, retryKey])

    const loadMore = async () => {
        const currentRequestId = requestId.current
        const nextPage = page + 1
        setIsLoadingMore(true)
        setError(null)
        try {
            const result = await ProductApiService.getProducts({
                page: nextPage,
                limit: PAGE_SIZE,
                search: query?.trim() || undefined,
                categoryId: categoryId || undefined,
                status: 'ACTIVE',
                sortBy: 'newest',
            })
            if (requestId.current !== currentRequestId) return
            setProducts((current) => [...current, ...result.items])
            setPage(nextPage)
            setTotal(result.pagination.total)
        } catch (loadError) {
            if (requestId.current === currentRequestId) {
                setError(loadError instanceof Error ? loadError.message : 'Không thể tải thêm sản phẩm')
            }
        } finally {
            if (requestId.current === currentRequestId) setIsLoadingMore(false)
        }
    }

    return (
        <section id="products" aria-labelledby="products-heading" className="mx-auto max-w-7xl scroll-mt-2 px-4 pt-2">
            <div className="sticky top-0 z-20 -mx-4 mb-3 bg-background px-4 pb-1 pt-1 sm:static sm:mx-0 sm:p-0">
                <h2 id="products-heading" className="text-lg font-bold text-neutral-800">
                    {title ?? 'Gợi ý hôm nay'}
                </h2>
            </div>

            {query ? (
                <p className="mb-3 text-sm text-neutral-600">
                    Kết quả cho <strong className="text-foreground">&ldquo;{query}&rdquo;</strong>: {total} sản phẩm
                </p>
            ) : null}

            {error ? (
                <div className="rounded-sm bg-white py-10 text-center shadow-sm">
                    <p className="font-medium text-red-600">{error}</p>
                    <button
                        type="button"
                        onClick={() => setRetryKey((current) => current + 1)}
                        className="mt-3 text-sm font-medium text-primary underline"
                    >
                        Thử lại
                    </button>
                </div>
            ) : isLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-sm bg-white py-16 text-neutral-600">
                    <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                    <span>Đang tải sản phẩm...</span>
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-sm bg-white py-16 text-center shadow-sm">
                    <SearchX className="size-10 text-neutral-300" aria-hidden="true" />
                    <p className="font-medium text-neutral-800">Không tìm thấy sản phẩm phù hợp</p>
                    <p className="text-sm text-neutral-500">Hãy thử từ khóa khác hoặc chọn một gợi ý ở thanh tìm kiếm.</p>
                </div>
            ) : (
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {products.map((product) => (
                        <li key={product.id}>
                            <ProductCard product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                        </li>
                    ))}
                </ul>
            )}

            {!error && products.length < total && (
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        className="flex h-11 w-full max-w-72 items-center justify-center gap-2 rounded-sm border border-[#ee4d2d] bg-white text-sm font-normal uppercase text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoadingMore && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                        {isLoadingMore ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                    </button>
                </div>
            )}
        </section>
    )
}
