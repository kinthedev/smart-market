"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { WishlistApiService } from "../api/wishlist.service";

type WishlistContextValue = {
  ids: string[];
  count: number;
  isReady: boolean;
  isLiked: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [ids, setIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds([]);
      setIsReady(true);
      return;
    }

    try {
      const list = await WishlistApiService.getIds();
      setIds(list);
    } catch {
      setIds([]);
    } finally {
      setIsReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;
    setIsReady(false);
    refresh();
  }, [isLoading, refresh]);

  const isLiked = useCallback(
    (productId: string) => ids.includes(productId),
    [ids]
  );

  const toggle = useCallback(
    async (productId: string) => {
      const liked = ids.includes(productId);

      // Cập nhật lạc quan để giao diện phản hồi ngay
      setIds((current) =>
        liked
          ? current.filter((id) => id !== productId)
          : [productId, ...current]
      );

      try {
        await WishlistApiService.toggle(productId, liked);
      } catch (error) {
        // Hoàn tác nếu gọi API thất bại
        setIds((current) =>
          liked
            ? [productId, ...current]
            : current.filter((id) => id !== productId)
        );
        throw error;
      }
    },
    [ids]
  );

  const value = useMemo(
    () => ({ ids, count: ids.length, isReady, isLiked, toggle, refresh }),
    [ids, isReady, isLiked, toggle, refresh]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist phải được dùng bên trong WishlistProvider");
  }
  return context;
}
