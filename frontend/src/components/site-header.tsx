'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, CircleHelp, Heart, LayoutDashboard, Link2, LogOut, Package, Search, ShoppingBag, ShoppingCart, Smartphone, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { hotKeywords, type User } from '@/src/data-seed/shop-data'
import { useCart } from '@/src/features/cart/hooks/use-cart'
import { useWishlist } from '@/src/features/wishlist/components/wishlist-provider'

type SiteHeaderProps = {
    user?: User | null
    onLogout?: () => void
    onSearch?: (query: string) => void
}

const topLinks = [
    { label: 'Tải ứng dụng', icon: Smartphone, className: '' },
    { label: 'Kết nối', icon: Link2, className: 'hidden sm:flex' },
    { label: 'Hỗ trợ', icon: CircleHelp, className: '' },
]

export function SiteHeader({ user, onLogout, onSearch }: SiteHeaderProps) {
    const [query, setQuery] = useState('')
    const [profileOpen, setProfileOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { totalQuantity } = useCart()
    const { count: wishlistCount } = useWishlist()

    // Đóng menu tài khoản khi bấm ra ngoài hoặc nhấn Escape.
    useEffect(() => {
        if (!profileOpen) return

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            if (!profileRef.current?.contains(event.target as Node)) {
                setProfileOpen(false)
            }
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setProfileOpen(false)
        }

        document.addEventListener('mousedown', handlePointerDown)
        document.addEventListener('touchstart', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handlePointerDown)
            document.removeEventListener('touchstart', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [profileOpen])

    const submit = (value: string) => {
        const keyword = value.trim()
        if (!keyword) return

        // Nếu trang hiện tại tự xử lý tìm kiếm (vd: trang chủ) thì dùng callback,
        // ngược lại điều hướng sang trang kết quả tìm kiếm chung.
        if (onSearch) {
            onSearch(keyword)
            return
        }

        router.push(`/search?q=${encodeURIComponent(keyword)}`)
    }

    return (
        <header className="bg-gradient-to-b from-primary to-orange-500 text-white">
            <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs">
                <nav aria-label="Liên kết nhanh" className="flex items-center gap-4">
                    {topLinks.map(({ label, icon: Icon, className }) => (
                        <a
                            key={label}
                            href="#"
                            className={`items-center gap-1.5 opacity-95 transition-opacity hover:opacity-100 hover:underline ${className || 'flex'}`}
                        >
                            <Icon className="size-3.5" aria-hidden="true" />
                            {label}
                        </a>
                    ))}
                </nav>

                {user ? (
                    <div className="flex items-center gap-3">
                        {user.isAdmin && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 rounded bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-white shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-[#5b5bd6]"
                                    title="Truy cập trang Quản trị cửa hàng"
                                >
                                    <LayoutDashboard className="size-3.5" />
                                    <span>Dashboard</span>
                                </Link>
                                <span aria-hidden="true" className="h-3 w-px bg-white/50" />
                            </>
                        )}
                        <div
                            ref={profileRef}
                            className="relative"
                            onMouseEnter={() => setProfileOpen(true)}
                            onMouseLeave={() => setProfileOpen(false)}
                        >
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                onFocus={() => setProfileOpen(true)}
                                aria-expanded={profileOpen}
                                aria-haspopup="menu"
                                className="flex items-center gap-2 rounded px-1 py-0.5 transition-opacity hover:opacity-90 hover:cursor-pointer"
                                title="Quản lý tài khoản"
                            >
                                <Avatar size="sm">
                                    {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                                    <AvatarFallback className="bg-white text-[10px] font-bold text-primary">
                                        {user.name.slice(0, 1).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="max-w-28 truncate font-medium hover:underline">{user.name}</span>
                                <ChevronDown
                                    className={`size-3.5 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                />
                            </button>

                            <div
                                className={`absolute right-0 top-full z-50 w-60 pt-2 transition-all duration-150 ${profileOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'}`}
                            >
                                <div
                                    role="menu"
                                    aria-label="Menu tài khoản"
                                    className="overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xl"
                                >
                                    <Link
                                        href="/account"
                                        role="menuitem"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-orange-50"
                                    >
                                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                            <UserRound className="size-4" aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-800">
                                                Tài khoản của tôi
                                            </span>
                                            <span className="block text-[11px] text-slate-500">
                                                Thông tin cá nhân & địa chỉ
                                            </span>
                                        </span>
                                    </Link>
                                    <Link
                                        href="/orders"
                                        role="menuitem"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-start gap-3 border-t border-slate-100 px-4 py-3 transition-colors hover:bg-orange-50"
                                    >
                                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <Package className="size-4" aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span className="block text-sm font-semibold text-slate-800">
                                                Đơn mua
                                            </span>
                                            <span className="block text-[11px] text-slate-500">
                                                Theo dõi đơn hàng đã đặt
                                            </span>
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <span aria-hidden="true" className="h-3 w-px bg-white/50" />
                        <button
                            type="button"
                            onClick={onLogout}
                            className="flex items-center gap-1 opacity-95 transition-opacity hover:underline hover:opacity-100"
                        >
                            <LogOut className="size-3.5" aria-hidden="true" />
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 font-medium">
                        <Link href="/signup" className='hover:underline'>Đăng kí</Link>
                        <span aria-hidden="true" className="h-3 w-px bg-white/50" />
                        <Link href="/login" className='hover:underline'>Đăng nhập</Link>

                    </div>
                )}
            </div>

            <div className="mx-auto flex max-w-7xl flex-wrap items-start gap-x-6 gap-y-2 px-4 pb-3 pt-2 md:flex-nowrap md:gap-x-10">
                <Link href="/" className="order-1 flex h-10 shrink-0 items-center gap-2" aria-label="CamMart - Trang chủ">
                    <span className="flex size-9 items-center justify-center rounded-sm bg-white text-primary">
                        <ShoppingBag className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight">
                        Smart<span className="text-yellow-300">Market</span>
                    </span>
                </Link>

                <div className="order-3 w-full md:order-2 md:w-auto md:flex-1">
                    <form
                        role="search"
                        className="flex rounded border border-[#eeeeee] bg-white p-0 shadow-sm"
                        onSubmit={(e) => {
                            e.preventDefault()
                            submit(query)
                        }}
                    >
                        <label htmlFor="site-search" className="sr-only">
                            Tìm kiếm sản phẩm
                        </label>
                        <input
                            id="site-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Freeship đơn từ 0đ - Tìm sản phẩm, thương hiệu..."
                            className="h-10 min-w-0  flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-neutral-400"
                        />
                        <button
                            type="submit"
                            aria-label="Tìm kiếm"
                            className="flex h-10 w-14 items-center justify-center  border-2 border-[#eeeeee] hover:cursor-pointer bg-primary text-white transition-colors hover:bg-orange-600 sm:w-16"
                        >
                            <Search className="size-4" aria-hidden="true" />
                        </button>
                    </form>

                    <ul className="mt-1.5 flex gap-x-3 overflow-x-auto whitespace-nowrap text-xs text-orange-50 [scrollbar-width:none]">
                        {hotKeywords.map((keyword, index) => (
                            <li key={keyword}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery(keyword)
                                        submit(keyword)
                                    }}
                                    className={`transition-colors hover:text-white hover:cursor-pointer ${index === 0 ? 'font-bold text-yellow-300' : ''}`}
                                >
                                    {keyword}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="order-2 ml-auto flex items-center gap-1 md:order-3 md:ml-0">
                    <Link
                        href="/wishlist"
                        aria-label={`Sản phẩm yêu thích, ${wishlistCount} sản phẩm`}
                        title="Sản phẩm yêu thích"
                        className="relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                    >
                        <Heart className="size-6" aria-hidden="true" />
                        {wishlistCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                                {wishlistCount > 99 ? '99+' : wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link
                        href="/cart"
                        aria-label={`Giỏ hàng, ${totalQuantity} sản phẩm`}
                        className="relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                    >
                        <ShoppingCart className="size-7" aria-hidden="true" />
                        {totalQuantity > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                                {totalQuantity > 99 ? '99+' : totalQuantity}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    )
}
