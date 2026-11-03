import Image from 'next/image'
import { Flame, Heart, ShieldCheck, ShoppingCart, Star, Zap } from 'lucide-react'
import { cn } from 'cn'
import { Price } from '@/src//features/products/components/price'
import { discountPercent, formatSold, type FlashSaleProduct, type Product, type ProductBadge } from '@/src/data-seed/shop-data'

type ProductCardProps = { product: Product | FlashSaleProduct; onAddToCart?: (product: Product) => void }

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

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const flash = 'stock' in product ? product : null
    const discount = flash?.discount ?? discountPercent(product.price, product.originalPrice)
    const badge = product.badge ? badgeStyles[product.badge] : null
    const BadgeIcon = badge?.icon

    return (
        <article className="group relative flex h-full -translate-y-0 flex-col overflow-hidden rounded-sm bg-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1280px) 200px, (min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {product.badge && badge && BadgeIcon && (
                    <span className={cn('absolute left-0 top-2 flex items-center gap-0.5 rounded-r-sm px-1.5 py-0.5 text-[10px] font-bold', badge.className)}>
                        <BadgeIcon className="size-3" aria-hidden="true" /> {product.badge}
                    </span>
                )}
                {discount > 0 && <span className="absolute right-0 top-0 rounded-bl-sm bg-[#feeeea] px-1.5 py-1 text-xs font-normal leading-tight text-price">-{discount}%</span>}
                {product.isNew && <span className="absolute bottom-2 left-2 rounded-sm bg-neutral-900/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">Mới</span>}
                <button
                    type="button"
                    onClick={() => onAddToCart?.(product)}
                    className="absolute inset-x-2 bottom-2 flex h-8 translate-y-2 items-center justify-center gap-1 rounded-sm bg-primary/95 text-xs font-bold text-white opacity-0 shadow transition-all duration-200 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                >
                    <ShoppingCart className="size-3.5" aria-hidden="true" /> Tìm đồ tương tự
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 p-2.5">
                <h3 className="line-clamp-2 min-h-10 text-sm font-normal leading-5 text-slate-800">{product.name}</h3>
                <ul className="flex min-h-5 flex-wrap gap-1">
                    {!flash && product.vouchers?.slice(0, 2).map((voucher) => (
                        <li key={voucher} className={cn('rounded-sm border px-1 text-[10px] font-normal leading-4', voucher === 'Freeship' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-sale/60 bg-red-50 text-sale')}>
                            {voucher}
                        </li>
                    ))}
                </ul>
                <div className="mt-auto pt-1">
                    <Price value={product.price} originalPrice={product.originalPrice} size="md" className="min-w-0 flex-col items-start" />
                </div>
                {flash ? (
                    <div className="pt-1"><SoldBar sold={flash.sold} stock={flash.stock} /></div>
                ) : (
                    <div className="flex items-center gap-1 whitespace-nowrap text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" /> {product.rating.toFixed(1)}</span>
                        <span className="text-slate-300">|</span>
                        <span>Đã bán {formatSold(product.sold)}</span>
                        <span className="ml-auto truncate pl-1">{product.id % 2 === 0 ? 'TP.HCM' : 'Hà Nội'}</span>
                    </div>
                )}
            </div>
        </article>
    )
}
