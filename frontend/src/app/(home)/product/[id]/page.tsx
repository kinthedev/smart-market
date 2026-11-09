"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Undo2,
  Zap,
} from "lucide-react";
import { ProductApiService } from "@/src/features/products/api/product.service";
import { Price } from "@/src/features/products/components/price";
import { SiteHeader } from "@/src/components/site-header";
import { SiteFooter } from "@/src/components/site-footer";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useCart } from "@/src/features/cart/hooks/use-cart";
import { WishlistButton } from "@/src/features/wishlist/components/wishlist-button";
import { ReviewSection } from "@/src/features/reviews/components/review-section";
import { CommentSection } from "@/src/features/comments/components/comment-section";
import type { User } from "@/src/data-seed/shop-data";
import type {
  Product as CatalogProduct,
  ProductStatus,
} from "@/src/features/products/types/product.types";

const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: "Đang bán",
  INACTIVE: "Ngừng bán",
  OUT_OF_STOCK: "Hết hàng",
};

const statusClasses: Record<ProductStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-600 ring-slate-200",
  OUT_OF_STOCK: "bg-red-50 text-red-600 ring-red-200",
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user: authUser, logout, isLoading: isAuthLoading } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "comments"
  >("description");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  const productId = params?.id ? decodeURIComponent(params.id) : "";

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    setIsLoading(true);

    ProductApiService.getProductById(productId)
      .then((data) => {
        if (mounted) setProduct(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [productId]);

  const currentUser: User | null = useMemo(() => {
    if (!authUser) return null;
    return {
      name: authUser.name || authUser.email || "Người dùng",
      email: authUser.email,
      avatarUrl: authUser.image || undefined,
      isAdmin: authUser.isAdmin,
    };
  }, [authUser]);

  const sizes = useMemo(
    () =>
      Array.from(
        new Set((product?.variants ?? []).map((v) => v.size).filter(Boolean))
      ) as string[],
    [product]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set((product?.variants ?? []).map((v) => v.color).filter(Boolean))
      ) as string[],
    [product]
  );

  const changeQuantity = (delta: number) => {
    setQuantity((current) => Math.min(Math.max(1, current + delta), 99));
  };

  const showNotice = (message: string, type: "success" | "error" = "success") => {
    setNoticeType(type);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  // Kiểm tra người dùng đã chọn đủ kích thước / màu sắc chưa
  const validateSelection = () => {
    if (sizes.length > 0 && !selectedSize) {
      showNotice("Vui lòng chọn kích thước trước khi mua hàng.", "error");
      return false;
    }
    if (colors.length > 0 && !selectedColor) {
      showNotice("Vui lòng chọn màu sắc trước khi mua hàng.", "error");
      return false;
    }
    return true;
  };

  const requireLogin = () => {
    if (!isAuthLoading && !authUser) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const images = product?.images ?? [];
  const mainImage = images[selectedImage]?.url;
  const hasSalePrice =
    product?.salePrice != null && product.salePrice < product.price;
  const displayedPrice = product
    ? hasSalePrice
      ? (product.salePrice as number)
      : product.price
    : 0;
  const canBuy = product?.status === "ACTIVE";

  const addCurrentSelection = () => {
    if (!product) return false;
    if (!validateSelection()) return false;
    if (!requireLogin()) return false;

    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url,
      price: displayedPrice,
      originalPrice: hasSalePrice ? product.price : undefined,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });
    return true;
  };

  const handleAddToCart = () => {
    if (!addCurrentSelection()) return;
    showNotice("Đã thêm sản phẩm vào giỏ hàng.");
  };

  const handleBuyNow = () => {
    if (!addCurrentSelection()) return;
    showNotice(
      "Đã ghi nhận đơn mua hàng. Chúng tôi sẽ liên hệ xác nhận đơn của bạn."
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader user={currentUser} onLogout={() => logout()} />

      <main className="mx-auto max-w-7xl px-4 py-4">
        {isLoading ? (
          <div className="grid gap-6 rounded-sm bg-white p-4 shadow-sm md:grid-cols-2">
            <div className="aspect-square w-full animate-pulse rounded bg-slate-100" />
            <div className="space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ) : !product ? (
          <div className="rounded-sm bg-white py-20 text-center shadow-sm">
            <p className="text-lg font-semibold text-neutral-800">
              Không tìm thấy sản phẩm
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Sản phẩm có thể đã bị xoá hoặc đường dẫn không đúng.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Về trang chủ
            </Link>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav
              aria-label="Đường dẫn"
              className="mb-3 flex flex-wrap items-center gap-1 text-xs text-neutral-500"
            >
              <Link href="/" className="hover:text-primary">
                Trang chủ
              </Link>
              {product.category ? (
                <>
                  <ChevronRight className="size-3" aria-hidden="true" />
                  <Link
                    href={`/category/${encodeURIComponent(product.category.slug)}`}
                    className="hover:text-primary"
                  >
                    {product.category.name}
                  </Link>
                </>
              ) : null}
              <ChevronRight className="size-3" aria-hidden="true" />
              <span className="line-clamp-1 text-neutral-700">{product.name}</span>
            </nav>

            <div className="grid gap-4 rounded-sm bg-white p-4 shadow-sm md:grid-cols-[minmax(0,420px)_1fr] md:gap-8">
              {/* Ảnh sản phẩm */}
              <div>
                <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-slate-100 bg-slate-50">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={images[selectedImage]?.altText || product.name}
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 420px, 100vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                      Sản phẩm chưa có hình ảnh
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {images.map((img, index) => (
                      <button
                        key={img.id ?? index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`relative size-16 overflow-hidden rounded-sm border-2 bg-slate-50 transition-colors ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent hover:border-slate-300"
                        }`}
                        aria-label={`Xem ảnh ${index + 1}`}
                      >
                        <Image
                          src={img.url}
                          alt={img.altText || `${product.name} ${index + 1}`}
                          fill
                          unoptimized
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Thông tin sản phẩm */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-xs font-semibold ring-1 ${statusClasses[product.status]}`}
                  >
                    {statusLabels[product.status]}
                  </span>
                  {product.category ? (
                    <span className="text-xs text-neutral-500">
                      {product.category.name}
                    </span>
                  ) : null}
                  <span className="text-xs text-neutral-400">
                    SKU: {product.sku}
                  </span>
                  <WishlistButton
                    productId={product.id}
                    variant="inline"
                    showLabel
                    className="ml-auto"
                  />
                </div>

                <h1 className="mt-2 text-xl font-bold leading-7 text-neutral-800 md:text-2xl">
                  {product.name}
                </h1>

                <div className="mt-3 rounded-sm bg-slate-50 p-3">
                  <Price
                    value={displayedPrice}
                    originalPrice={hasSalePrice ? product.price : undefined}
                    size="xl"
                    showDiscount
                  />
                </div>

                {/* Kích thước */}
                {sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-1.5 text-sm font-semibold text-neutral-700">
                      Kích thước
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-12 rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                            selectedSize === size
                              ? "border-primary bg-orange-50 text-primary"
                              : "border-slate-200 text-neutral-700 hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Màu sắc */}
                {colors.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-1.5 text-sm font-semibold text-neutral-700">
                      Màu sắc
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                            selectedColor === color
                              ? "border-primary bg-orange-50 text-primary"
                              : "border-slate-200 text-neutral-700 hover:border-primary"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedSize || selectedColor) && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Đã chọn:{" "}
                    <strong className="text-neutral-700">
                      {[selectedSize, selectedColor].filter(Boolean).join(" / ")}
                    </strong>
                  </p>
                )}

                {/* Số lượng */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-700">
                    Số lượng
                  </span>
                  <div className="flex items-center rounded-sm border border-slate-200">
                    <button
                      type="button"
                      onClick={() => changeQuantity(-1)}
                      disabled={quantity <= 1}
                      className="flex size-8 items-center justify-center text-neutral-600 disabled:opacity-40"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(1)}
                      disabled={quantity >= 99}
                      className="flex size-8 items-center justify-center text-neutral-600 disabled:opacity-40"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {notice ? (
                  <p
                    className={`mt-3 rounded-sm px-3 py-2 text-sm ${
                      noticeType === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {notice}
                  </p>
                ) : null}

                <div id="mua-hang" className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canBuy}
                    className="flex h-11 items-center justify-center gap-2 rounded-sm border border-primary bg-orange-50 text-sm font-bold uppercase text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!canBuy}
                    className="flex h-11 items-center justify-center gap-2 rounded-sm bg-primary text-sm font-bold uppercase text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Zap className="size-4" aria-hidden="true" />
                    Mua hàng
                  </button>
                </div>

                <ul className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-xs text-neutral-600 sm:grid-cols-3">
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-600" />
                    Hàng chính hãng
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Truck className="size-4 text-primary" />
                    Giao nhanh 2H
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Undo2 className="size-4 text-primary" />
                    Đổi trả 7 ngày
                  </li>
                </ul>
              </div>
            </div>

            {/* Mô tả, đánh giá & bình luận */}
            <section className="mt-4 rounded-sm bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-1 border-b border-slate-100">
                {(
                  [
                    { id: "description", label: "Mô tả" },
                    {
                      id: "reviews",
                      label: `Đánh giá (${product.reviewCount ?? 0})`,
                    },
                    {
                      id: "comments",
                      label: `Bình luận (${product.commentCount ?? 0})`,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-3">
                {activeTab === "description" ? (
                  product.description ? (
                    <p className="whitespace-pre-line text-sm leading-6 text-neutral-600">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-sm text-neutral-500">
                      Sản phẩm chưa có mô tả chi tiết.
                    </p>
                  )
                ) : null}

                {activeTab === "reviews" ? (
                  <ReviewSection productId={product.id} />
                ) : null}

                {activeTab === "comments" ? (
                  <CommentSection productId={product.id} />
                ) : null}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
