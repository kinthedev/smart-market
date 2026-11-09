"use client";

import { Star } from "lucide-react";
import { cn } from "cn";

const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: keyof typeof sizeClasses;
  className?: string;
};

export function StarRating({
  value,
  onChange,
  size = "md",
  className,
}: StarRatingProps) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={onChange ? "radiogroup" : undefined}
      aria-label={`${value} trên 5 sao`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value >= star;

        if (onChange) {
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              aria-label={`Chọn ${star} sao`}
              aria-checked={filled}
              role="radio"
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300"
                )}
                aria-hidden="true"
              />
            </button>
          );
        }

        return (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              filled ? "fill-amber-400 text-amber-400" : "text-slate-300"
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
