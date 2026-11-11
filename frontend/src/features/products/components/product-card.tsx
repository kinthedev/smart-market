'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Flame, Heart, ShieldCheck, ShoppingCart, Star, Zap } from 'lucide-react'
import { cn } from 'cn'
import { Price } from '@/src//features/products/components/price'
import { WishlistButton } from '@/src/features/wishlist/components/wishlist-button'
import { discountPercent, formatSold, type FlashSaleProduct, type Product, type ProductBadge } from '@/src/data-seed/shop-data'
import type { Product as CatalogProduct } from '../types/product.types'

export type ProductCardItem = Product | CatalogProduct

type ProductCardProps = {
    product: ProductCardItem | FlashSaleProduct
    onAddToCart?: (product: ProductCardItem) => void
    onProductClick?: (product: ProductCardItem | FlashSaleProduct) => void
}

const badgeStyles: Record<ProductBadge, { className: string; icon: typeof Heart }> = {
    'Chính hãng': { className: 'bg-white text-primary ring-1 ring-[#eeeeee]', icon: ShieldCheck },
    'Yêu thích': { className: 'bg-primary text-white', icon: Heart },
    'Giao 2H': { className: 'bg-emerald-600 text-white', icon: Zap },
}

function SoldBar({ sold, stock }: { sold: number; stock: number }) {
    const percent = Math.min(100, Math.max(12, Math.round((sold / stock) * 100)))
    const almostGone = percent >= 85
    return (
        <div role="img" aria-label={almostGone ? 'Sắp cháy hàng' : `Đã bán ${formatSold(sold)}`} className="relative h-4 overflow-hidden rounded-full bg-orange-100">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-[#ee4d2d]" style={{ width: `${percent}%` }} />
            <Flame aria-hidden="true" className="animate-flame absolute left-1 top-1/2 size-3.5 -translate-y-1/2 fill-red-500 text-red-600" />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase text-white [text-shadow:0_0_2px_rgba(0,0,0,0.45)]">
                {almostGone ? 'Sắp cháy hàng' : `Đã bán ${formatSold(sold)}`}
            </span>
        </div>
    )
}

export function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
    const router = useRouter()
    const flash = 'stock' in product ? product : null
    const catalogProduct = 'images' in product
    const image = catalogProduct ? product.images[0]?.url : product.image
    const hasSalePrice =
        catalogProduct &&
        product.salePrice != null &&
        product.salePrice < product.price
    const displayedPrice = hasSalePrice ? product.salePrice : product.price
    const originalPrice = catalogProduct
        ? hasSalePrice
            ? product.price
            : undefined
        : product.originalPrice
    const discount = flash?.discount ?? discountPercent(displayedPrice, originalPrice)
    const productBadge = 'badge' in product ? product.badge : undefined
    const isNew = 'isNew' in product && product.isNew
    const badge = productBadge ? badgeStyles[productBadge] : null
    const BadgeIcon = badge?.icon

    const handleClick = () => {
        onProductClick?.(product)

        // Sản phẩm thật trong database -> mở trang chi tiết
        if ('images' in product) {
            router.push(`/product/${product.id}`)
        }
    }

    return (
        <article
            onClick={handleClick}
            className="group relative flex h-full -translate-y-0 cursor-pointer flex-col overflow-hidden rounded-sm bg-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="relative aspect-square overflow-hidden bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        unoptimized
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1280px) 200px, (min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" role="img" aria-label={`${product.name} chưa có hình ảnh`} />
                )}
                {productBadge && badge && BadgeIcon && (
                    <span className={cn('absolute left-0 top-2 flex items-center gap-0.5 rounded-r-sm px-1.5 py-0.5 text-[10px] font-bold', badge.className)}>
                        <BadgeIcon className="size-3" aria-hidden="true" /> {productBadge}
                    </span>
                )}
                {discount > 0 && <span className="absolute right-0 top-11 rounded-bl-sm bg-orange-50 px-1.5 py-1 text-xs font-semibold leading-tight text-primary">-{discount}%</span>}
                {isNew && <span className="absolute bottom-2 left-2 rounded-sm bg-neutral-900/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">Mới</span>}
                {catalogProduct && <WishlistButton productId={product.id} />}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddToCart?.(product)
                    }}
                    className="absolute inset-x-2 bottom-2 flex h-8 translate-y-2 items-center justify-center gap-1 rounded-sm bg-primary/95 text-xs font-bold text-white opacity-0 shadow transition-all duration-200 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                >
                    <ShoppingCart className="size-3.5" aria-hidden="true" /> Thêm vào giỏ
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-0.5 p-2.5">
                <h3 className="line-clamp-2 min-h-10 text-sm font-normal leading-5 text-slate-800">{product.name}</h3>
                <ul className="flex min-h-0 flex-wrap gap-1">
                    {!flash && !catalogProduct && product.vouchers?.slice(0, 2).map((voucher) => (
                        <li key={voucher} className={cn('rounded-sm border px-1 text-[10px] font-normal leading-4', voucher === 'Freeship' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-sale/60 bg-red-50 text-sale')}>
                            {voucher}
                        </li>
                    ))}
                </ul>
                <div className="pt-0.5">
                    <Price value={displayedPrice} originalPrice={originalPrice} size="md" className="min-w-0 flex-col items-start" />
                </div>
                {flash ? (
                    <div className="pt-1"><SoldBar sold={flash.sold} stock={flash.stock} /></div>
                ) : (
                    <div className="flex items-center gap-1 whitespace-nowrap text-[11px] text-slate-500">
                        {!catalogProduct ? (
                            <>
                                <span className="flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" /> {product.rating.toFixed(1)}</span>
                                <span className="text-slate-300">|</span>
                                <span>Đã bán {formatSold(product.sold)}</span>
                            </>
                        ) : (
                            <span className="flex min-w-0 items-center gap-1">
                                <span className="truncate">{product.category?.name ?? 'Sản phẩm'}</span>
                                {product.reviewCount ? (
                                    <>
                                        <span className="text-slate-300">|</span>
                                        <span className="flex shrink-0 items-center gap-0.5">
                                            <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                                            {(product.ratingAvg ?? 0).toFixed(1)} ({product.reviewCount})
                                        </span>
                                    </>
                                ) : null}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </article>
    )
}
