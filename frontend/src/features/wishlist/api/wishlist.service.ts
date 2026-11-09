const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export type WishlistToggleResult = {
  liked: boolean;
  total: number;
};

export class WishlistApiService {
  static async getIds(): Promise<string[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/wishlist/ids`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  }

  static async getWishlist(): Promise<any[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/wishlist`, {
      cache: "no-store",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể tải sản phẩm yêu thích");
    }
    return data.data;
  }

  static async add(productId: string): Promise<WishlistToggleResult> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/wishlist/${encodeURIComponent(productId)}`,
      { method: "POST", credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể thêm vào yêu thích");
    }
    return data.data;
  }

  static async remove(productId: string): Promise<WishlistToggleResult> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/wishlist/${encodeURIComponent(productId)}`,
      { method: "DELETE", credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể bỏ yêu thích");
    }
    return data.data;
  }

  static async toggle(
    productId: string,
    isLiked: boolean
  ): Promise<WishlistToggleResult> {
    return isLiked ? WishlistApiService.remove(productId) : WishlistApiService.add(productId);
  }
}
