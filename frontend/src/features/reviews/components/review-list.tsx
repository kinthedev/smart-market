"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { BadgeCheck, Pencil, Trash2 } from "lucide-react";
import { StarRating } from "./star-rating";
import type { Review } from "../types/review.types";

type ReviewListProps = {
  reviews: Review[];
  currentUserId?: string;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function ReviewList({
  reviews,
  currentUserId,
  onEdit,
  onDelete,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="rounded-sm bg-slate-50 px-4 py-6 text-center text-sm text-neutral-500">
        Chưa có đánh giá nào phù hợp.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-100">
      {reviews.map((review) => {
        const isMine = review.user.id === currentUserId;

        return (
          <li key={review.id} className="py-3">
            <div className="flex items-start gap-2">
              <Avatar size="sm">
                {review.user.image ? (
                  <AvatarImage src={review.user.image} alt={review.user.name} />
                ) : null}
                <AvatarFallback className="bg-orange-50 text-xs font-bold text-primary">
                  {review.user.name?.slice(0, 1).toUpperCase() || "K"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-neutral-800">
                    {review.user.name}
                  </span>
                  {review.verifiedPurchase ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-emerald-600">
                      <BadgeCheck className="size-3.5" aria-hidden="true" />
                      Đã mua hàng
                    </span>
                  ) : null}
                  <span className="text-[11px] text-neutral-400">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                <StarRating value={review.rating} size="sm" className="mt-0.5" />

                {review.content ? (
                  <p className="mt-1 whitespace-pre-line text-sm leading-5 text-neutral-700">
                    {review.content}
                  </p>
                ) : (
                  <p className="mt-1 text-sm italic text-neutral-400">
                    Người dùng chỉ chấm điểm, không để lại nội dung.
                  </p>
                )}

                {review.isHidden ? (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    Đánh giá đang bị ẩn
                  </p>
                ) : null}

                {isMine && (onEdit || onDelete) ? (
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(review)}
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-primary"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        Sửa
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(review)}
                        className="inline-flex items-center gap-1 text-neutral-500 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                        Xoá
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
