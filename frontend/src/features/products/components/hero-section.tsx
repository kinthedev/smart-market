'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Ticket, Truck } from 'lucide-react'
import { cn } from 'cn'
import { heroSlides } from '@/src/data-seed/shop-data'
import Link from 'next/link'
const AUTO_PLAY_MS = 5000

function SideBanners() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
                href="#"
                className="group relative flex min-h-32 items-center gap-4 overflow-hidden rounded  bg-gradient-to-br from-sale to-red-500 p-4 text-white shadow-sm"
            >
                <span aria-hidden="true" className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-background" />
                <span aria-hidden="true" className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-background" />
                <span className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-white/20 transition-transform group-hover:rotate-12">
                    <Ticket className="size-7" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-200">Mã Giảm Giá</p>
                    <p className="text-xl font-extrabold leading-tight">Giảm đến 100k</p>
                    <p className="mt-1 text-xs text-white/90">Đơn từ 299k · Nhập mã CAM100</p>
                    <span className="mt-2 inline-block rounded-sm bg-white px-3 py-0.5 text-xs font-bold text-sale">Lưu mã</span>
                </div>
            </a>

            <a
                href="#"
                className="group relative flex min-h-32 items-center gap-4 overflow-hidden rounded  bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-sm"
            >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-white/20 transition-transform group-hover:translate-x-1">
                    <Truck className="size-7" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-100">Giao Nhanh 2H</p>
                    <p className="text-xl font-extrabold leading-tight">Nhận hàng trong 2 giờ</p>
                    <p className="mt-1 text-xs text-white/95">Nội thành TP.HCM & Hà Nội · Freeship từ 0đ</p>
                    <span className="mt-2 inline-block rounded-sm bg-white px-3 py-0.5 text-xs font-bold text-orange-600">Mua ngay</span>
                </div>
            </a>
        </div>
    )
}

export function HeroSection() {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused) return
        const id = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), AUTO_PLAY_MS)
        return () => clearInterval(id)
    }, [paused])

    const go = (delta: number) => setIndex((i) => (i + delta + heroSlides.length) % heroSlides.length)

    return (
        <section aria-label="Banner nổi bật" className="mx-auto max-w-7xl px-4 pt-4">
            <div className="grid gap-3 lg:grid-cols-3">
                <div
                    className="group relative min-h-56 overflow-hidden rounded  bg-orange-500 shadow-sm sm:min-h-72 lg:col-span-2 lg:min-h-80"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    aria-roledescription="carousel"
                >
                    {heroSlides.map((slide, i) => (
                        <article
                            key={slide.id}
                            aria-hidden={i !== index}
                            className={cn(
                                'absolute inset-0 transition-opacity duration-700',
                                i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                            )}
                        >
                            <Image
                                src={slide.image}
                                alt=""
                                fill
                                sizes="(min-width: 1280px) 840px, (min-width: 1024px) 66vw, 100vw"
                                className="object-cover object-right"
                                priority={i === 0}
                            />
                            <div className={cn('absolute inset-0 bg-gradient-to-r', slide.overlay)} />
                            <div className="relative flex h-full max-w-[70%] flex-col justify-center gap-2 p-5 sm:max-w-[62%] sm:gap-3 sm:p-8">
                                <p className="w-fit rounded-sm bg-white/95 px-2 py-0.5 text-[11px] font-bold uppercase text-sale sm:text-xs">
                                    {slide.eyebrow}
                                </p>
                                <h2 className="text-balance text-xl font-extrabold leading-tight text-white drop-shadow sm:text-3xl lg:text-4xl">
                                    {slide.title}
                                </h2>
                                <p className="text-balance text-2xl font-black leading-none text-yellow-300 drop-shadow sm:text-4xl lg:text-5xl">
                                    {slide.highlight}
                                </p>
                                <p className="hidden text-sm text-white/95 sm:block">{slide.subtitle}</p>
                                <a
                                    href="#"
                                    tabIndex={i === index ? 0 : -1}
                                    className="mt-1 w-fit rounded-sm bg-white px-5 py-2 text-sm font-bold text-primary shadow transition-colors hover:bg-yellow-300 hover:text-sale"
                                >
                                    {slide.cta}
                                </a>
                            </div>
                        </article>
                    ))}

                    <button
                        type="button"
                        aria-label="Banner trước"
                        onClick={() => go(-1)}
                        className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow transition-opacity hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-sm:hidden"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Banner sau"
                        onClick={() => go(1)}
                        className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 opacity-0 shadow transition-opacity hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-sm:hidden"
                    >
                        <ChevronRight className="size-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {heroSlides.map((slide, i) => (
                            <button
                                key={slide.id}
                                type="button"
                                aria-label={`Đến banner ${i + 1}`}
                                aria-current={i === index}
                                onClick={() => setIndex(i)}
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
                                )}
                            />
                        ))}
                    </div>
                </div>

                <SideBanners />
            </div>
        </section>
    )
}
