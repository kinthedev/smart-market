"use client";

import { StarRating } from "./star-rating";
import type { ReviewSummary as ReviewSummaryData } from "../types/review.types";

type ReviewSummaryProps = {
  summary: ReviewSummaryData;
  activeRating: number | null;
  onSelectRating: (rating: number | null) => void;
};

export function ReviewSummary({
  summary,
  activeRating,
  onSelectRating,
}: ReviewSummaryProps) {
  const total = summary.reviewCount;

  return (
    <div className="grid gap-4 rounded-sm bg-slate-50 p-4 sm:grid-cols-[180px_1fr]">
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-4xl font-extrabold text-primary">
          {summary.ratingAvg.toFixed(1)}
          <span className="text-base font-medium text-neutral-400">/5</span>
        </p>
        <StarRating value={summary.ratingAvg} size="md" />
        <p className="text-xs text-neutral-500">
          {total > 0 ? `${total} đánh giá` : "Chưa có đánh giá"}
        </p>
      </div>

      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary.histogram[String(star)] ?? 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          const isActive = activeRating === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectRating(isActive ? null : star)}
              className={`flex w-full items-center gap-2 rounded-sm px-1 py-0.5 text-xs transition-colors ${
                isActive ? "bg-orange-100" : "hover:bg-white"
              }`}
              title={`Lọc ${star} sao`}
            >
              <span className="flex w-10 shrink-0 items-center gap-0.5 text-neutral-600">
                {star}
                <span className="text-amber-400">★</span>
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <span
                  className="block h-full rounded-full bg-amber-400"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right text-neutral-500">
                {count}
              </span>
            </button>
          );
        })}
        {activeRating ? (
          <button
            type="button"
            onClick={() => onSelectRating(null)}
            className="text-xs font-medium text-primary underline"
          >
            Bỏ lọc {activeRating} sao
          </button>
        ) : null}
      </div>
    </div>
  );
}
