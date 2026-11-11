'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

type LazySectionProps = {
    children: ReactNode
    /** Chiều cao tối thiểu giữ chỗ trước khi section được tải, tránh nhảy layout */
    minHeight?: number
    /** Khoảng cách tải trước khi section lọt vào viewport */
    rootMargin?: string
    className?: string
}

/**
 * Chỉ render children khi section sắp lọt vào viewport.
 * Dùng cho các khối nặng ở trang chủ (Flash Sale, danh sách sản phẩm...)
 * để tránh gọi API và tải ảnh ngay khi vừa mở trang.
 */
export function LazySection({
    children,
    minHeight = 320,
    rootMargin = '300px 0px',
    className,
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (visible) return
        const element = ref.current
        if (!element) return

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [visible, rootMargin])

    return (
        <div ref={ref} className={cn(className)} style={visible ? undefined : { minHeight }}>
            {visible ? children : null}
        </div>
    )
}
