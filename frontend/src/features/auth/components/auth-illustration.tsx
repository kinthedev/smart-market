import React from "react";
import { Sparkles, TrendingUp, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { cn } from "cn";

interface AuthIllustrationProps extends React.ComponentProps<"div"> {
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function AuthIllustration({
  className,
  title = "Mua Sắm & Kinh Doanh",
  subtitle = "Trải nghiệm gợi ý thông minh, ưu đãi độc quyền và hàng triệu sản phẩm thịnh hành mỗi ngày.",
  badge = "HỆ SINH THÁI SMART MARKET",
  ...props
}: AuthIllustrationProps) {
  return (
    <div
      className={cn(
        "relative hidden flex-col justify-between overflow-hidden border-l border-orange-100/80 bg-gradient-to-br from-orange-50/90 via-amber-50/50 to-orange-100/70 p-8 md:flex dark:border-border dark:from-orange-950/25 dark:via-background dark:to-orange-900/15",
        className
      )}
      {...props}
    >
      {/* Ambient warm glows */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-amber-400/15 blur-3xl" />

      {/* Decorative dot matrix */}
      <div className="pointer-events-none absolute top-6 right-6 grid grid-cols-5 gap-3 opacity-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="size-1 rounded-full bg-orange-600" />
        ))}
      </div>

      {/* Center Graphic & Badges */}
      <div className="relative my-auto flex flex-col items-center justify-center py-6">
        {/* Floating AI Recommendation Badge */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 absolute -top-2 left-2 z-10 flex items-center gap-2.5 rounded-sm border border-slate-200/80 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-card/95">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-xs bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            <Sparkles className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase">
              CÔNG NGHỆ AI
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Gợi ý theo gu của bạn
            </span>
          </div>
        </div>

        {/* Central Illustration Artwork */}
        <div className="relative size-60 sm:size-68">
          <img
            src="/auth-banner.svg"
            alt="Minh họa Smart Market"
            className="h-full w-full object-contain drop-shadow-sm select-none transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Floating Trend Intelligence Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 absolute -bottom-1 right-2 z-10 flex items-center gap-2.5 rounded-sm border border-slate-200/80 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-card/95">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-xs bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <TrendingUp className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold tracking-wider text-emerald-700 uppercase">
              +86% Xu Hướng Hot
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Sản phẩm bán chạy
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Text Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 rounded-sm bg-orange-500/10 px-2.5 py-1 text-xs font-bold tracking-wider text-orange-600 dark:text-orange-400">
          <ShoppingBag className="size-3.5" />
          <span>{badge}</span>
        </div>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
          {title}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-balance text-slate-600 sm:text-sm dark:text-slate-400">
          {subtitle}
        </p>

        {/* Trust metrics */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>100% Chính hãng</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5.0 Đánh giá</span>
          </div>
        </div>
      </div>
    </div>
  );
}

