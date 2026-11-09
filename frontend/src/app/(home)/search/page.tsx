"use client";

import { Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/src/features/products/components/product-grid";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useCart } from "@/src/features/cart/hooks/use-cart";
import { buildCartItem } from "@/src/features/cart/utils/cart-item";
import type { Product, User } from "@/src/data-seed/shop-data";
import type { Product as CatalogProduct } from "@/src/features/products/types/product.types";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: authUser, logout, isLoading } = useAuth();
  const { addItem } = useCart();

  const query = (searchParams.get("q") ?? "").trim();

  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null;
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    };
  }, [authUser]);

  const handleAddToCart = (product: Product | CatalogProduct) => {
    if (!isLoading && !authUser) {
      router.push("/login");
      return;
    }
    addItem(buildCartItem(product));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader user={currentUser} onLogout={() => logout()} />
      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-3 rounded-sm bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Kết quả tìm kiếm
          </p>
          <h1 className="text-xl font-bold text-neutral-800">
            {query ? `Sản phẩm cho “${query}”` : "Vui lòng nhập từ khóa tìm kiếm"}
          </h1>
        </div>

        {query ? (
          <ProductGrid
            query={query}
            title="Sản phẩm phù hợp"
            onAddToCart={handleAddToCart}
          />
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground">
          <main className="mx-auto max-w-7xl px-4 py-16 text-center text-neutral-500">
            Đang tải kết quả tìm kiếm...
          </main>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
