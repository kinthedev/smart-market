import type {
  Review,
  ReviewListResponse,
  ReviewSummary,
} from "../types/review.types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

type ReviewPayload = {
  rating: number;
  content?: string | null;
};

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
  }
  return data.data as T;
}

export class ReviewApiService {
  static async getSummary(productId: string): Promise<ReviewSummary> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/${encodeURIComponent(productId)}/reviews/summary`,
      { cache: "no-store", credentials: "include" }
    );
    return parseResponse<ReviewSummary>(res);
  }

  static async getReviews(
    productId: string,
    params?: { page?: number; limit?: number; rating?: number }
  ): Promise<ReviewListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.rating) query.set("rating", String(params.rating));

    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/${encodeURIComponent(productId)}/reviews?${query.toString()}`,
      { cache: "no-store", credentials: "include" }
    );
    return parseResponse<ReviewListResponse>(res);
  }

  static async createReview(
    productId: string,
    payload: ReviewPayload
  ): Promise<Review> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/${encodeURIComponent(productId)}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    return parseResponse<Review>(res);
  }

  static async updateReview(
    id: string,
    payload: Partial<ReviewPayload>
  ): Promise<Review> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/reviews/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      }
    );
    return parseResponse<Review>(res);
  }

  static async deleteReview(id: string): Promise<{ id: string }> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/reviews/${encodeURIComponent(id)}`,
      { method: "DELETE", credentials: "include" }
    );
    return parseResponse<{ id: string }>(res);
  }

  static async getMyReviews(): Promise<Review[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/reviews/my`, {
      cache: "no-store",
      credentials: "include",
    });
    return parseResponse<Review[]>(res);
  }

  static async getAllReviews(params?: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: number;
    isHidden?: string;
  }): Promise<ReviewListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.rating) query.set("rating", String(params.rating));
    if (params?.isHidden) query.set("isHidden", params.isHidden);

    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/reviews?${query.toString()}`,
      { cache: "no-store", credentials: "include" }
    );
    return parseResponse<ReviewListResponse>(res);
  }

  static async setHidden(id: string, isHidden: boolean): Promise<Review> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/reviews/${encodeURIComponent(id)}/hide`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden }),
        credentials: "include",
      }
    );
    return parseResponse<Review>(res);
  }
}
