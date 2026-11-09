"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LoaderCircle } from "lucide-react";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useCart } from "@/src/features/cart/hooks/use-cart";
import { buildCartItem } from "@/src/features/cart/utils/cart-item";
import { useWishlist } from "@/src/features/wishlist/components/wishlist-provider";
import { WishlistApiService } from "@/src/features/wishlist/api/wishlist.service";
import { ProductCard } from "@/src/features/products/components/product-card";
import type { Product as CatalogProduct } from "@/src/features/products/types/product.types";
import type { User } from "@/src/data-seed/shop-data";

export default function WishlistPage() {
  const router = useRouter();
  const { user: authUser, logout, isLoading: isAuthLoading } = useAuth();
  const { addItem } = useCart();
  const { ids, isReady } = useWishlist();

  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null;
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    };
  }, [authUser]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!authUser) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    setIsLoading(true);

    WishlistApiService.getWishlist()
      .then((data) => {
        if (mounted) setItems(data as CatalogProduct[]);
      })
      .catch(() => {
        if (mounted) setItems([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [authUser, isAuthLoading]);

  // Đồng bộ với trạng thái tim: bỏ yêu thích sẽ biến mất khỏi danh sách ngay
  const products = useMemo(
    () => items.filter((item) => ids.includes(item.id)),
    [items, ids]
  );

  const handleAddToCart = (product: CatalogProduct) => {
    if (!isAuthLoading && !authUser) {
      router.push("/login");
      return;
    }
    addItem(buildCartItem(product));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader user={currentUser} onLogout={() => logout()} />

      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-3 flex items-center justify-between rounded-sm bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Bộ sưu tập của bạn
            </p>
            <h1 className="text-xl font-bold text-neutral-800">
              Sản phẩm yêu thích
            </h1>
          </div>
          <span className="text-sm text-neutral-500">
            {products.length} sản phẩm
          </span>
        </div>

        {isAuthLoading || isLoading || !isReady ? (
          <div className="flex items-center justify-center gap-2 rounded-sm bg-white py-16 text-neutral-600 shadow-sm">
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
            <span>Đang tải sản phẩm yêu thích...</span>
          </div>
        ) : !authUser ? (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white py-20 text-center shadow-sm">
            <Heart className="size-12 text-neutral-300" aria-hidden="true" />
            <p className="text-lg font-semibold text-neutral-800">
              Đăng nhập để xem sản phẩm yêu thích
            </p>
            <p className="text-sm text-neutral-500">
              Danh sách yêu thích được lưu theo tài khoản của bạn.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Đăng nhập
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-sm bg-white py-20 text-center shadow-sm">
            <Heart className="size-12 text-neutral-300" aria-hidden="true" />
            <p className="text-lg font-semibold text-neutral-800">
              Bạn chưa yêu thích sản phẩm nào
            </p>
            <p className="text-sm text-neutral-500">
              Nhấn vào biểu tượng trái tim trên sản phẩm để lưu lại.
            </p>
            <Link
              href="/"
              className="mt-2 inline-flex rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
