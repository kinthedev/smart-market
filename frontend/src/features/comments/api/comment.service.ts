import type { Comment, CommentListResponse } from "../types/comment.types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
  }
  return data.data as T;
}

export class CommentApiService {
  static async getComments(
    productId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CommentListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/${encodeURIComponent(productId)}/comments?${query.toString()}`,
      { cache: "no-store", credentials: "include" }
    );
    return parseResponse<CommentListResponse>(res);
  }

  static async createComment(
    productId: string,
    content: string
  ): Promise<Comment> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/${encodeURIComponent(productId)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      }
    );
    return parseResponse<Comment>(res);
  }

  static async updateComment(id: string, content: string): Promise<Comment> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/comments/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      }
    );
    return parseResponse<Comment>(res);
  }

  static async deleteComment(id: string): Promise<{ id: string }> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/comments/${encodeURIComponent(id)}`,
      { method: "DELETE", credentials: "include" }
    );
    return parseResponse<{ id: string }>(res);
  }

  static async getAllComments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isHidden?: string;
  }): Promise<CommentListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.isHidden) query.set("isHidden", params.isHidden);

    const res = await fetch(
      `${BACKEND_URL}/api/v1/admin/comments?${query.toString()}`,
      { cache: "no-store", credentials: "include" }
    );
    return parseResponse<CommentListResponse>(res);
  }

  static async setHidden(id: string, isHidden: boolean): Promise<Comment> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/comments/${encodeURIComponent(id)}/hide`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden }),
        credentials: "include",
      }
    );
    return parseResponse<Comment>(res);
  }
}
