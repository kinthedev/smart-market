"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductApiService } from "@/src/features/products/api/product.service";
import { ProductGrid } from "@/src/features/products/components/product-grid";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useCart } from "@/src/features/cart/hooks/use-cart";
import { buildCartItem } from "@/src/features/cart/utils/cart-item";
import type { Category, Product as CatalogProduct } from "@/src/features/products/types/product.types";
import type { Product, User } from "@/src/data-seed/shop-data";

export default function CategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { user: authUser, logout, isLoading } = useAuth();
  const { addItem } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  const slug = params?.categoryId ? decodeURIComponent(params.categoryId) : "";

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setIsCategoryLoading(true);

    ProductApiService.getCategoryBySlug(slug)
      .then((data) => {
        if (mounted) setCategory(data);
      })
      .finally(() => {
        if (mounted) setIsCategoryLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

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
            Danh mục ngành hàng
          </p>
          {isCategoryLoading ? (
            <div className="mt-1 h-6 w-40 animate-pulse rounded bg-slate-100" />
          ) : category ? (
            <>
              <h1 className="text-xl font-bold text-neutral-800">{category.name}</h1>
              {category.description ? (
                <p className="mt-1 text-sm text-neutral-500">{category.description}</p>
              ) : null}
            </>
          ) : (
            <h1 className="text-xl font-bold text-neutral-800">Không tìm thấy danh mục</h1>
          )}
        </div>

        {category ? (
          <ProductGrid
            categoryId={category.id}
            title={`Sản phẩm: ${category.name}`}
            onAddToCart={handleAddToCart}
          />
        ) : !isCategoryLoading ? (
          <div className="rounded-sm bg-white py-16 text-center text-neutral-500 shadow-sm">
            Danh mục này không tồn tại hoặc đã bị xoá.
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
