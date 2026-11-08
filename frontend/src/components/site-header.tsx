'use client'

import { useState } from 'react'
import { CircleHelp, LayoutDashboard, Link2, LogOut, Search, ShoppingBag, ShoppingCart, Smartphone } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import Link from 'next/link'
import { hotKeywords, type User } from '@/src/data-seed/shop-data'

type SiteHeaderProps = {
    user?: User | null
    cartCount: number
    onLogout?: () => void
    onSearch?: (query: string) => void
}

const topLinks = [
    { label: 'Tải ứng dụng', icon: Smartphone, className: '' },
    { label: 'Kết nối', icon: Link2, className: 'hidden sm:flex' },
    { label: 'Hỗ trợ', icon: CircleHelp, className: '' },
]

export function SiteHeader({ user, cartCount, onLogout, onSearch }: SiteHeaderProps) {
    const [query, setQuery] = useState('')

    const submit = (value: string) => onSearch?.(value.trim())

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
                        <Link
                            href="/account"
                            className="flex items-center gap-2 transition-opacity hover:opacity-90"
                            title="Quản lý tài khoản"
                        >
                            <Avatar size="sm">
                                {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.name} /> : null}
                                <AvatarFallback className="bg-white text-[10px] font-bold text-primary">
                                    {user.name.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="max-w-28 truncate font-medium hover:underline">{user.name}</span>
                        </Link>
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
                <a href="/" className="order-1 flex h-10 shrink-0 items-center gap-2" aria-label="CamMart - Trang chủ">
                    <span className="flex size-9 items-center justify-center rounded-sm bg-white text-primary">
                        <ShoppingBag className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight">
                        Smart<span className="text-yellow-300">Market</span>
                    </span>
                </a>

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

                <button
                    type="button"
                    aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
                    className="relative order-2 ml-auto flex size-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 md:order-3 md:ml-0"
                >
                    <ShoppingCart className="size-7" aria-hidden="true" />
                    {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sale px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    )
}
