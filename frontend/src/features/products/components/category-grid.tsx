'use client'

import * as React from 'react'
import {
    Baby,
    BookOpen,
    Camera,
    Car,
    ChevronLeft,
    ChevronRight,
    CookingPot,
    Dog,
    Dumbbell,
    Footprints,
    Gem,
    Gift,
    Glasses,
    HeartPulse,
    Headphones,
    Home,
    Laptop,
    Shirt,
    ShoppingBag,
    Smartphone,
    Sparkles,
    SprayCan,
    Ticket,
    UtensilsCrossed,
    Wallet,
    Watch,
    type LucideIcon,
} from 'lucide-react'
import { cn } from 'cn'
import { categories, type CategoryIcon } from '@/src/data-seed/shop-data'

const icons: Record<CategoryIcon, LucideIcon> = {
    shirt: Shirt,
    dress: Shirt,
    baby: Baby,
    'shoe-men': Footprints,
    'shoe-women': Footprints,
    'wallet-men': Wallet,
    'bag-women': ShoppingBag,
    glasses: Glasses,
    watch: Watch,
    gem: Gem,
    sparkles: Sparkles,
    'heart-pulse': HeartPulse,
    home: Home,
    spray: SprayCan,
    groceries: UtensilsCrossed,
    pet: Dog,
    smartphone: Smartphone,
    laptop: Laptop,
    headphones: Headphones,
    camera: Camera,
    appliance: CookingPot,
    car: Car,
    toy: Gift,
    book: BookOpen,
    dumbbell: Dumbbell,
    ticket: Ticket,
}

// Icon gradient background mềm mại, cao cấp
const iconGradients: Record<CategoryIcon, string> = {
    shirt: 'from-blue-500/15 to-blue-500/5 text-blue-600 border-blue-200/60',
    dress: 'from-rose-500/15 to-rose-500/5 text-rose-600 border-rose-200/60',
    baby: 'from-pink-500/15 to-pink-500/5 text-pink-600 border-pink-200/60',
    'shoe-men': 'from-orange-500/15 to-orange-500/5 text-orange-700 border-orange-200/60',
    'shoe-women': 'from-red-500/15 to-red-500/5 text-red-600 border-red-200/60',
    'wallet-men': 'from-teal-600/15 to-teal-600/5 text-teal-700 border-teal-200/60',
    'bag-women': 'from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-600 border-fuchsia-200/60',
    glasses: 'from-purple-500/15 to-purple-500/5 text-purple-600 border-purple-200/60',
    watch: 'from-indigo-500/15 to-indigo-500/5 text-indigo-600 border-indigo-200/60',
    gem: 'from-amber-500/15 to-amber-500/5 text-amber-600 border-amber-200/60',
    sparkles: 'from-pink-500/15 to-pink-500/5 text-pink-600 border-pink-200/60',
    'heart-pulse': 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 border-emerald-200/60',
    home: 'from-orange-500/15 to-orange-500/5 text-orange-600 border-orange-200/60',
    spray: 'from-cyan-500/15 to-cyan-500/5 text-cyan-600 border-cyan-200/60',
    groceries: 'from-green-500/15 to-green-500/5 text-green-700 border-green-200/60',
    pet: 'from-yellow-500/15 to-yellow-500/5 text-yellow-700 border-yellow-200/60',
    smartphone: 'from-sky-500/15 to-sky-500/5 text-sky-600 border-sky-200/60',
    laptop: 'from-blue-500/15 to-blue-500/5 text-blue-700 border-blue-200/60',
    headphones: 'from-violet-500/15 to-violet-500/5 text-violet-600 border-violet-200/60',
    camera: 'from-sky-600/15 to-sky-600/5 text-sky-700 border-sky-200/60',
    appliance: 'from-teal-500/15 to-teal-500/5 text-teal-600 border-teal-200/60',
    car: 'from-red-500/15 to-red-500/5 text-red-600 border-red-200/60',
    toy: 'from-rose-500/15 to-rose-500/5 text-rose-600 border-rose-200/60',
    book: 'from-amber-500/15 to-amber-500/5 text-amber-700 border-amber-200/60',
    dumbbell: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700 border-emerald-200/60',
    ticket: 'from-lime-500/15 to-lime-500/5 text-lime-700 border-lime-200/60',
}

export function CategoryGrid() {
    const scrollerRef = React.useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = React.useState(false)
    const [canScrollRight, setCanScrollRight] = React.useState(true)

    const checkScroll = React.useCallback(() => {
        const el = scrollerRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 10)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
    }, [])

    React.useEffect(() => {
        checkScroll()
        const el = scrollerRef.current
        if (!el) return
        el.addEventListener('scroll', checkScroll, { passive: true })
        window.addEventListener('resize', checkScroll)
        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
        }
    }, [checkScroll])

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollerRef.current
        if (!el) return
        const scrollAmount = el.clientWidth * 0.75
        el.scrollBy({
            left: direction === 'right' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
        })
    }

    return (
        <section aria-labelledby="category-heading" className="mx-auto max-w-7xl px-4 pt-3">
            <div className="relative rounded-lg bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                    <h2 id="category-heading" className="text-sm font-bold uppercase tracking-wide text-neutral-700">
                        Danh mục ngành hàng
                    </h2>
                </div>

                <div className="relative">
                    {/* Danh sách cuộn ngang đúng 2 hàng với snap để căn chỉnh từng cột vừa khít */}
                    <div
                        ref={scrollerRef}
                        className="grid grid-flow-col grid-rows-2 auto-cols-[calc((100%-32px)/4)] gap-x-2.5 gap-y-2 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-48px)/6)] md:auto-cols-[calc((100%-64px)/8)] lg:auto-cols-[calc((100%-72px)/10)]"
                    >
                        {categories.map((category) => {
                            const Icon = icons[category.icon] || Sparkles
                            const gradientClass = iconGradients[category.icon] || 'from-slate-500/15 to-slate-500/5 text-slate-600 border-slate-200/60'

                            return (
                                <a
                                    key={category.id}
                                    href={`#category-${category.id}`}
                                    className="group flex flex-col items-center justify-start gap-1.5 rounded-lg p-1.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50/80"
                                >
                                    <div
                                        className={cn(
                                            'relative flex size-11 items-center justify-center rounded-2xl border bg-gradient-to-b shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:shadow-md sm:size-12',
                                            gradientClass
                                        )}
                                    >
                                        <Icon className="size-5 transition-transform duration-200 group-hover:scale-110 sm:size-6" strokeWidth={1.8} />
                                    </div>
                                    <span className="line-clamp-2 w-full text-center text-[11px] font-medium leading-tight text-neutral-700 transition-colors group-hover:text-primary sm:text-xs">
                                        {category.name}
                                    </span>
                                </a>
                            )
                        })}
                    </div>

                    {/* Mũi tên điều hướng bên trái */}
                    {canScrollLeft && (
                        <button
                            type="button"
                            aria-label="Xem danh mục trước"
                            onClick={() => scroll('left')}
                            className="absolute -left-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all hover:bg-slate-50 hover:text-primary focus:outline-none sm:size-9"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                    )}

                    {/* Mũi tên điều hướng bên phải */}
                    {canScrollRight && (
                        <button
                            type="button"
                            aria-label="Xem thêm danh mục"
                            onClick={() => scroll('right')}
                            className="absolute -right-3 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all hover:bg-slate-50 hover:text-primary focus:outline-none sm:size-9"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}
