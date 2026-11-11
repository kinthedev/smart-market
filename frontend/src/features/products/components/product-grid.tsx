'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle, SearchX } from 'lucide-react'
import { ProductApiService } from '../api/product.service'
import type { Product as CatalogProduct } from '../types/product.types'
import { ProductCard } from './product-card'

const PAGE_SIZE = 20

type ProductGridProps = {
    query?: string
    categoryId?: string
    title?: string
    /** Ẩn một sản phẩm khỏi danh sách (vd: sản phẩm đang xem ở trang chi tiết) */
    excludeProductId?: string
    onAddToCart?: (product: CatalogProduct) => void
    onProductClick?: (product: CatalogProduct) => void
}

/** Khung xương hiển thị trong lúc tải trang đầu tiên */
function ProductSkeleton() {
    return (
        <ul
            aria-hidden="true"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
            {Array.from({ length: 12 }).map((_, index) => (
                <li key={index} className="overflow-hidden rounded-sm bg-white">
                    <div className="aspect-square animate-pulse bg-neutral-100" />
                    <div className="space-y-2 p-2.5">
                        <div className="h-3 w-full animate-pulse rounded bg-neutral-100" />
                        <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-100" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
                    </div>
                </li>
            ))}
        </ul>
    )
}

export function ProductGrid({ query, categoryId, title, excludeProductId, onAddToCart, onProductClick }: ProductGridProps) {
    const [products, setProducts] = useState<CatalogProduct[]>([])
    const [total, setTotal] = useState(0)
    const [hasMore, setHasMore] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
    const [retryKey, setRetryKey] = useState(0)

    // requestId dùng để bỏ qua response cũ khi người dùng đổi bộ lọc / từ khóa liên tục
    const requestId = useRef(0)
    // Trang kế tiếp cần tải thêm (tránh closure cũ của state page)
    const nextPageRef = useRef(1)
    const isLoadingMoreRef = useRef(false)
    const sentinelRef = useRef<HTMLDivElement | null>(null)
    // Sản phẩm bị loại trừ có nằm trong kết quả trả về hay không (để bù trừ tổng số)
    const excludedFoundRef = useRef(false)

    // 1. Tải trang đầu tiên mỗi khi đổi từ khóa / danh mục
    useEffect(() => {
        const currentRequestId = ++requestId.current
        setProducts([])
        setTotal(0)
        setHasMore(false)
        setError(null)
        setLoadMoreError(null)
        setIsLoading(true)
        setIsLoadingMore(false)
        isLoadingMoreRef.current = false
        nextPageRef.current = 1
        excludedFoundRef.current = false

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
                const excludedFound = excludeProductId
                    ? result.items.some((item) => item.id === excludeProductId)
                    : false
                excludedFoundRef.current = excludedFound
                setProducts(
                    excludeProductId
                        ? result.items.filter((item) => item.id !== excludeProductId)
                        : result.items
                )
                setTotal(Math.max(0, result.pagination.total - (excludedFound ? 1 : 0)))
                nextPageRef.current = 2
                setHasMore(result.pagination.page < result.pagination.totalPages)
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
    }, [query, categoryId, excludeProductId, retryKey])

    // 2. Tải thêm sản phẩm (dùng chung cho nút "Xem thêm" và infinite scroll)
    const loadMore = useCallback(async () => {
        if (isLoadingMoreRef.current) return
        isLoadingMoreRef.current = true
        setIsLoadingMore(true)
        setLoadMoreError(null)

        const currentRequestId = requestId.current
        try {
            const result = await ProductApiService.getProducts({
                page: nextPageRef.current,
                limit: PAGE_SIZE,
                search: query?.trim() || undefined,
                categoryId: categoryId || undefined,
                status: 'ACTIVE',
                sortBy: 'newest',
            })
            if (requestId.current !== currentRequestId) return

            // Gộp và loại bỏ trùng lặp phòng trường hợp dữ liệu thay đổi giữa các trang
            setProducts((current) => {
                const existingIds = new Set(current.map((item) => item.id))
                const nextItems = result.items.filter(
                    (item) => item.id !== excludeProductId && !existingIds.has(item.id)
                )
                return [...current, ...nextItems]
            })
            setTotal(
                Math.max(0, result.pagination.total - (excludedFoundRef.current ? 1 : 0))
            )
            nextPageRef.current += 1
            setHasMore(
                result.items.length > 0 && result.pagination.page < result.pagination.totalPages
            )
        } catch (loadError) {
            if (requestId.current === currentRequestId) {
                setLoadMoreError(
                    loadError instanceof Error ? loadError.message : 'Không thể tải thêm sản phẩm'
                )
            }
        } finally {
            if (requestId.current === currentRequestId) {
                isLoadingMoreRef.current = false
                setIsLoadingMore(false)
            }
        }
    }, [query, categoryId, excludeProductId])

    // 3. Infinite scroll: tự tải khi sentinel lọt vào viewport (cách 400px để tải sớm)
    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel || !hasMore || isLoading || isLoadingMore || error) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore()
            },
            { rootMargin: '400px 0px' }
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [hasMore, isLoading, isLoadingMore, error, loadMore])

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
                <ProductSkeleton />
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

            {!error && products.length > 0 && (
                <div ref={sentinelRef} className="mt-6 flex flex-col items-center gap-2">
                    {hasMore ? (
                        <button
                            type="button"
                            onClick={loadMore}
                            disabled={isLoadingMore}
                            className="flex h-11 w-full max-w-72 items-center justify-center gap-2 rounded-sm border border-[#ee4d2d] bg-white text-sm font-normal uppercase text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoadingMore && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
                            {isLoadingMore ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                        </button>
                    ) : (
                        <p className="py-2 text-sm text-neutral-500">
                            Đã hiển thị tất cả {total} sản phẩm
                        </p>
                    )}

                    {isLoadingMore && hasMore ? (
                        <p className="text-xs text-neutral-400">Đang tải thêm sản phẩm khi bạn cuộn...</p>
                    ) : null}

                    {loadMoreError ? (
                        <div className="flex items-center gap-3 text-sm text-red-600">
                            <span>{loadMoreError}</span>
                            <button type="button" onClick={loadMore} className="font-medium underline">
                                Thử lại
                            </button>
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    )
}
