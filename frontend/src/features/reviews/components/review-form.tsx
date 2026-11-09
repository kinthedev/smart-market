"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { ReviewApiService } from "../api/review.service";
import { StarRating } from "./star-rating";
import type { Review } from "../types/review.types";

type ReviewFormProps = {
  productId: string;
  initialReview?: Review | null;
  onSuccess: () => void;
  onCancel?: () => void;
};

export function ReviewForm({
  productId,
  initialReview,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialReview?.rating ?? 0);
  const [content, setContent] = useState(initialReview?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialReview);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (rating < 1) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialReview) {
        await ReviewApiService.updateReview(initialReview.id, {
          rating,
          content: content.trim() || null,
        });
      } else {
        await ReviewApiService.createReview(productId, {
          rating,
          content: content.trim() || null,
        });
      }

      if (!initialReview) {
        setRating(0);
        setContent("");
      }
      onSuccess();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Không thể gửi đánh giá."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-slate-200 p-4"
    >
      <p className="text-sm font-semibold text-neutral-800">
        {isEditing ? "Sửa đánh giá của bạn" : "Viết đánh giá"}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-neutral-600">Chấm điểm:</span>
        <StarRating value={rating} onChange={setRating} size="lg" />
        <span className="text-xs text-neutral-500">
          {rating > 0 ? `${rating}/5 sao` : "Chưa chọn"}
        </span>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        maxLength={1000}
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm (không bắt buộc)..."
        className="mt-3 w-full resize-y rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {error ? (
        <p className="mt-2 rounded-sm bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-9 items-center justify-center gap-1.5 rounded-sm bg-primary px-4 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          {isSubmitting && (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          )}
          {isEditing ? "Cập nhật đánh giá" : "Gửi đánh giá"}
        </button>

        {isEditing && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-9 rounded-sm border border-slate-200 px-4 text-sm text-neutral-600 hover:border-slate-300"
          >
            Huỷ
          </button>
        ) : null}
      </div>
    </form>
  );
}
