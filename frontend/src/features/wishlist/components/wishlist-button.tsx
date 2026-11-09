"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LoaderCircle } from "lucide-react";
import { cn } from "cn";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useWishlist } from "./wishlist-provider";

type WishlistButtonProps = {
  productId: string;
  variant?: "overlay" | "inline";
  className?: string;
  showLabel?: boolean;
};

export function WishlistButton({
  productId,
  variant = "overlay",
  className,
  showLabel = false,
}: WishlistButtonProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { isLiked, toggle } = useWishlist();
  const [isPending, setIsPending] = useState(false);

  const liked = isLiked(productId);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setIsPending(true);
    try {
      await toggle(productId);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật sản phẩm yêu thích."
      );
    } finally {
      setIsPending(false);
    }
  };

  const label = liked ? "Bỏ yêu thích" : "Thêm vào yêu thích";

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1.5 rounded-sm border px-3 text-sm font-medium transition-colors disabled:opacity-60",
          liked
            ? "border-sale/40 bg-red-50 text-sale"
            : "border-slate-200 text-neutral-700 hover:border-primary hover:text-primary",
          className
        )}
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Heart
            className={cn("size-4", liked && "fill-sale")}
            aria-hidden="true"
          />
        )}
        {showLabel && <span>{liked ? "Đã yêu thích" : "Yêu thích"}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={label}
      title={label}
      className={cn(
        "absolute right-1.5 top-1.5 z-10 flex size-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:text-sale disabled:opacity-60",
        liked && "text-sale",
        className
      )}
    >
      {isPending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Heart
          className={cn("size-4", liked && "fill-sale text-sale")}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
