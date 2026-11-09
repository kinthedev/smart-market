"use client";

import { useCallback, useEffect, useState } from "react";
import { ReviewApiService } from "../api/review.service";
import type { Review, ReviewSummary } from "../types/review.types";

const PAGE_SIZE = 5;

export function useProductReviews(productId: string) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    try {
      const data = await ReviewApiService.getSummary(productId);
      setSummary(data);
    } catch {
      // Giữ nguyên dữ liệu cũ nếu lỗi mạng
    }
  }, [productId]);

  const loadPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError("");

      try {
        const data = await ReviewApiService.getReviews(productId, {
          page: targetPage,
          limit: PAGE_SIZE,
          rating: filterRating ?? undefined,
        });

        setReviews((current) =>
          append ? [...current, ...data.items] : data.items
        );
        setPage(data.pagination.page);
        setTotal(data.pagination.total);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải đánh giá."
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [productId, filterRating]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  const refresh = useCallback(async () => {
    await Promise.all([loadSummary(), loadPage(1, false)]);
  }, [loadSummary, loadPage]);

  const loadMore = useCallback(() => {
    if (reviews.length >= total) return;
    loadPage(page + 1, true);
  }, [loadPage, page, reviews.length, total]);

  return {
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
  };
}
