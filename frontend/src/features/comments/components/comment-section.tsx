"use client";

import Link from "next/link";
import { LoaderCircle, MessageSquare } from "lucide-react";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useInfiniteScroll } from "@/src/lib/use-infinite-scroll";
import { CommentApiService } from "../api/comment.service";
import { useProductComments } from "../hooks/use-product-comments";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import type { Comment } from "../types/comment.types";

export function CommentSection({ productId }: { productId: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    comments,
    total,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
  } = useProductComments(productId);

  const hasMore = comments.length < total;
  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore,
  });

  const handleDelete = async (comment: Comment) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá bình luận này?")) return;

    try {
      await CommentApiService.deleteComment(comment.id);
      await refresh();
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xoá bình luận."
      );
    }
  };

  const handleUpdate = async (id: string, content: string) => {
    await CommentApiService.updateComment(id, content);
    await refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
        <MessageSquare className="size-4 text-primary" aria-hidden="true" />
        {total} bình luận
      </div>

      {isAuthLoading ? null : user ? (
        <CommentForm productId={productId} onSuccess={refresh} />
      ) : (
        <p className="rounded-sm bg-slate-50 px-4 py-3 text-sm text-neutral-600">
          Vui lòng{" "}
          <Link href="/login" className="font-semibold text-primary underline">
            đăng nhập
          </Link>{" "}
          để bình luận về sản phẩm.
        </p>
      )}

      {error ? (
        <p className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Đang tải bình luận...
        </div>
      ) : (
        <>
          <CommentList
            comments={comments}
            currentUserId={user?.id}
            onUpdate={handleUpdate}
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
                Xem thêm bình luận
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
