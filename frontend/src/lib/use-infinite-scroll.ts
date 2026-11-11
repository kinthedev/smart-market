'use client'

import { useEffect, useRef, type RefObject } from 'react'

type UseInfiniteScrollOptions = {
    /** Còn dữ liệu để tải thêm hay không */
    hasMore: boolean
    /** Đang tải (lần đầu hoặc tải thêm) — tránh gọi trùng */
    isLoading: boolean
    /** Hàm tải thêm, nên được bọc useCallback để ổn định identity */
    onLoadMore: () => void
    /** Tải trước khi sentinel lọt vào viewport */
    rootMargin?: string
}

/**
 * Trả về ref gắn vào phần tử sentinel ở cuối danh sách.
 * Khi sentinel lọt vào viewport (cách `rootMargin`), tự động gọi `onLoadMore`.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
    hasMore,
    isLoading,
    onLoadMore,
    rootMargin = '250px 0px',
}: UseInfiniteScrollOptions): RefObject<T | null> {
    const sentinelRef = useRef<T | null>(null)

    useEffect(() => {
        const element = sentinelRef.current
        if (!element || !hasMore || isLoading) return
        if (typeof IntersectionObserver === 'undefined') return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) onLoadMore()
            },
            { rootMargin }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [hasMore, isLoading, onLoadMore, rootMargin])

    return sentinelRef
}
