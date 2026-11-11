"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle, ShoppingBag } from "lucide-react";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useInfiniteScroll } from "@/src/lib/use-infinite-scroll";
import { ReviewApiService } from "../api/review.service";
import { useProductReviews } from "../hooks/use-product-reviews";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { ReviewSummary } from "./review-summary";
import type { Review } from "../types/review.types";

export function ReviewSection({ productId }: { productId: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    summary,
    reviews,
    total,
    filterRating,
    setFilterRating,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
  } = useProductReviews(productId);

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const hasMore = reviews.length < total;
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
  });

  const handleDelete = async (review: Review) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá đánh giá này?")) return;

    try {
      await ReviewApiService.deleteReview(review.id);
      await refresh();
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xoá đánh giá."
      );
    }
  };

  if (!summary) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-500">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        Đang tải đánh giá...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReviewSummary
        summary={summary}
        activeRating={filterRating}
        onSelectRating={setFilterRating}
      />

      {isAuthLoading ? null : !user ? (
        <p className="rounded-sm bg-slate-50 px-4 py-3 text-sm text-neutral-600">
          Vui lòng{" "}
          <Link href="/login" className="font-semibold text-primary underline">
            đăng nhập
          </Link>{" "}
          để đánh giá sản phẩm.
        </p>
      ) : editingReview ? (
        <ReviewForm
          productId={productId}
          initialReview={editingReview}
          onSuccess={async () => {
            setEditingReview(null);
            await refresh();
          }}
          onCancel={() => setEditingReview(null)}
        />
      ) : summary.myReview ? (
        <p className="rounded-sm bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Bạn đã đánh giá sản phẩm này. Có thể sửa hoặc xoá trong danh sách bên
          dưới.
        </p>
      ) : summary.canReview ? (
        <ReviewForm productId={productId} onSuccess={refresh} />
      ) : (
        <div className="flex flex-col gap-2 rounded-sm bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="size-4" aria-hidden="true" />
            Bạn cần mua sản phẩm này để có thể đánh giá.
          </span>
          <a
            href="#mua-hang"
            className="inline-flex w-fit rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
          >
            Mua ngay
          </a>
        </div>
      )}

      {error ? (
        <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Đang tải đánh giá...
        </div>
      ) : (
        <>
          <ReviewList
            reviews={reviews}
            currentUserId={user?.id}
            onEdit={setEditingReview}
            onDelete={handleDelete}
          />

          {hasMore ? (
            <div ref={sentinelRef} className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="flex h-9 items-center justify-center gap-2 rounded-sm border border-slate-200 px-4 text-sm text-neutral-600 hover:border-primary hover:text-primary disabled:opacity-60"
              >
                {isLoadingMore && (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Xem thêm đánh giá
              </button>
              <span className="text-xs text-neutral-400">
                Tự động tải thêm khi bạn cuộn xuống
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
