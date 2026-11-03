import {
    Baby,
    ChevronRight,
    Dumbbell,
    Gift,
    Headphones,
    House,
    Laptop,
    Shirt,
    Smartphone,
    Sparkles,
    Watch,
    type LucideIcon,
} from 'lucide-react'
import { cn } from 'cn'
import { categories, type CategoryIcon } from '@/src/data-seed/shop-data'

const icons: Record<CategoryIcon, LucideIcon> = {
    shirt: Shirt,
    smartphone: Smartphone,
    home: House,
    sparkles: Sparkles,
    baby: Baby,
    headphones: Headphones,
    dumbbell: Dumbbell,
    watch: Watch,
    laptop: Laptop,
    gift: Gift,
}

const iconColors: Record<CategoryIcon, string> = {
    shirt: 'bg-orange-100 text-orange-600',
    smartphone: 'bg-blue-100 text-blue-600',
    home: 'bg-amber-100 text-amber-600',
    sparkles: 'bg-pink-100 text-pink-600',
    baby: 'bg-sky-100 text-sky-600',
    headphones: 'bg-violet-100 text-violet-600',
    dumbbell: 'bg-emerald-100 text-emerald-600',
    watch: 'bg-indigo-100 text-indigo-600',
    laptop: 'bg-slate-100 text-slate-700',
    gift: 'bg-red-100 text-red-600',
}

export function CategoryGrid() {
    return (
        <section aria-labelledby="category-heading" className="mx-auto max-w-7xl px-4 pt-3">
            <div className="bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-2">
                    <h2 id="category-heading" className="text-sm font-bold uppercase tracking-wide text-neutral-600">
                        Danh mục ngành hàng
                    </h2>
                    <a href="#" className="flex items-center text-xs font-medium text-primary hover:underline">
                        Xem tất cả <ChevronRight className="size-4" aria-hidden="true" />
                    </a>
                </div>
                <ul className="grid grid-cols-5 gap-y-2 px-2 py-3 sm:grid-cols-5 lg:grid-cols-10 lg:gap-y-1">
                    {categories.map((category) => {
                        const Icon = icons[category.icon]
                        return (
                            <li key={category.id}>
                                <a href="#" className="group flex flex-col items-center gap-1.5 px-1 text-center">
                                    <span
                                        className={cn(
                                            'flex size-12 items-center justify-center rounded-xl transition-transform group-hover:-translate-y-0.5 group-hover:shadow-sm sm:size-14',
                                            iconColors[category.icon]
                                        )}
                                    >
                                        <Icon className="size-7 stroke-[2.5]" aria-hidden="true" />
                                    </span>
                                    <span className="text-xs font-medium leading-tight text-neutral-800 group-hover:text-primary">
                                        {category.name}
                                    </span>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
