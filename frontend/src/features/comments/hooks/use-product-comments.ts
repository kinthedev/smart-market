"use client";

import { useCallback, useEffect, useState } from "react";
import { CommentApiService } from "../api/comment.service";
import type { Comment } from "../types/comment.types";

const PAGE_SIZE = 5;

export function useProductComments(productId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadPage = useCallback(
    async (targetPage: number, append: boolean) => {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);
      setError("");

      try {
        const data = await CommentApiService.getComments(productId, {
          page: targetPage,
          limit: PAGE_SIZE,
        });

        setComments((current) =>
          append ? [...current, ...data.items] : data.items
        );
        setPage(data.pagination.page);
        setTotal(data.pagination.total);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải bình luận."
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    loadPage(1, false);
  }, [loadPage]);

  const refresh = useCallback(() => loadPage(1, false), [loadPage]);

  const loadMore = useCallback(() => {
    if (comments.length >= total) return;
    loadPage(page + 1, true);
  }, [comments.length, loadPage, page, total]);

  return {
    comments,
    total,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
  };
}
