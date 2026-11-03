import { cn } from 'cn'
import { discountPercent, formatPrice } from '@/src/data-seed/shop-data'

type PriceSize = 'sm' | 'md' | 'lg' | 'xl'

type PriceProps = {
    value: number
    originalPrice?: number
    size?: PriceSize
    showDiscount?: boolean
    className?: string
}

const currentSize: Record<PriceSize, string> = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
}

const originalSize: Record<PriceSize, string> = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
}

export function Price({ value, originalPrice, size = 'md', showDiscount = false, className }: PriceProps) {
    const discount = discountPercent(value, originalPrice)

    return (
        <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
            <p className={cn('price-text leading-none', currentSize[size])}>
                <span className="sr-only">{formatPrice(value)} đồng</span>
                <span aria-hidden="true">
                    {formatPrice(value)}
                    <span className="ml-px align-baseline text-[0.6em] underline decoration-1 underline-offset-[0.1em]">đ</span>
                </span>
            </p>
            {originalPrice && originalPrice > value && (
                <>
                    <del className={cn('price-original font-normal', originalSize[size])}>
                        <span className="sr-only">Giá gốc {formatPrice(originalPrice)} đồng</span>
                        <span aria-hidden="true">{formatPrice(originalPrice)}đ</span>
                    </del>
                    {showDiscount && discount > 0 && (
                        <span className="rounded-sm bg-price/10 px-1.5 py-0.5 text-[11px] font-normal leading-none text-price">
                            -{discount}%
                        </span>
                    )}
                </>
            )}
        </div>
    )
}
