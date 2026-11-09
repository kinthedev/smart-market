"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useCart } from "@/src/features/cart/hooks/use-cart";
import { formatPrice } from "@/src/data-seed/shop-data";
import type { User } from "@/src/data-seed/shop-data";

export default function CartPage() {
  const router = useRouter();
  const { user: authUser, logout, isLoading } = useAuth();
  const { items, totalQuantity, subtotal, updateQuantity, removeItem, clear } =
    useCart();
  const [notice, setNotice] = useState("");

  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null;
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    };
  }, [authUser]);

  const handleCheckout = () => {
    if (!isLoading && !authUser) {
      router.push("/login");
      return;
    }
    if (items.length === 0) return;

    setNotice(
      "Đã ghi nhận đơn hàng. Chúng tôi sẽ liên hệ xác nhận và giao hàng cho bạn."
    );
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader user={currentUser} onLogout={() => logout()} />

      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between rounded-sm bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Giỏ hàng của bạn
            </p>
            <h1 className="text-xl font-bold text-neutral-800">
              {totalQuantity > 0
                ? `${totalQuantity} sản phẩm`
                : "Giỏ hàng đang trống"}
            </h1>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-sm font-medium text-neutral-500 hover:text-red-600"
            >
              Xoá toàn bộ
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white py-20 text-center shadow-sm">
            <ShoppingBag className="size-12 text-neutral-300" aria-hidden="true" />
            <p className="text-lg font-semibold text-neutral-800">
              Chưa có sản phẩm nào trong giỏ hàng
            </p>
            <p className="text-sm text-neutral-500">
              Hãy khám phá các sản phẩm và thêm vào giỏ hàng của bạn.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            {/* Danh sách sản phẩm */}
            <section className="space-y-2">
              {items.map((item) => (
                <article
                  key={item.key}
                  className="flex gap-3 rounded-sm bg-white p-3 shadow-sm"
                >
                  <Link
                    href={`/product/${item.productId}`}
                    className="relative size-20 shrink-0 overflow-hidden rounded-sm border border-slate-100 bg-slate-50"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">
                        Không ảnh
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productId}`}
                      className="line-clamp-2 text-sm font-medium text-neutral-800 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {(item.size || item.color) && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Phân loại:{" "}
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="text-base font-semibold text-primary">
                        {formatPrice(item.price)}đ
                      </span>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(item.originalPrice)}đ
                          </span>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-sm border border-slate-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="flex size-8 items-center justify-center text-neutral-600 disabled:opacity-40"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.key, item.quantity + 1)
                          }
                          disabled={item.quantity >= 99}
                          className="flex size-8 items-center justify-center text-neutral-600 disabled:opacity-40"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                        Xoá
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Tóm tắt đơn hàng */}
            <aside className="h-fit rounded-sm bg-white p-4 shadow-sm lg:sticky lg:top-4">
              <h2 className="text-base font-bold text-neutral-800">
                Tóm tắt đơn hàng
              </h2>

              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between text-neutral-600">
                  <dt>Tạm tính</dt>
                  <dd className="font-medium text-neutral-800">
                    {formatPrice(subtotal)}đ
                  </dd>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <dt>Phí vận chuyển</dt>
                  <dd className="font-medium text-emerald-600">Miễn phí</dd>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base">
                  <dt className="font-semibold text-neutral-800">Tổng cộng</dt>
                  <dd className="font-bold text-primary">
                    {formatPrice(subtotal)}đ
                  </dd>
                </div>
              </dl>

              {notice ? (
                <p className="mt-3 rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {notice}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-sm bg-primary text-sm font-bold uppercase text-white transition-colors hover:bg-orange-600"
              >
                Mua hàng
              </button>
              <Link
                href="/"
                className="mt-2 flex h-10 w-full items-center justify-center rounded-sm border border-slate-200 text-sm font-medium text-neutral-700 hover:border-primary hover:text-primary"
              >
                Tiếp tục mua sắm
              </Link>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
