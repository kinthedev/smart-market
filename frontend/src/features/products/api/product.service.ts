import { env } from "@/src/lib/env";
import type {
  Product,
  Category,
  ProductFormData,
  ProductListResponse,
} from "../types/product.types";

const BACKEND_URL = env.BACKEND_URL;

export class ProductApiService {
  static async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/categories`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      return [];
    }
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/categories/${encodeURIComponent(slug)}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  }

  static async createCategory(data: { name: string; description?: string }): Promise<Category> {
    const res = await fetch(`${BACKEND_URL}/api/v1/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Không thể tạo danh mục");
    }
    return result.data;
  }

  static async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: string;
    saleType?: "regular" | "discount" | "flash-sale";
    sortBy?: "newest" | "price-asc";
  }): Promise<ProductListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.status) query.set("status", params.status);
    if (params?.saleType) query.set("saleType", params.saleType);
    if (params?.sortBy) query.set("sortBy", params.sortBy);

    const res = await fetch(`${BACKEND_URL}/api/v1/products?${query.toString()}`, {
      cache: "no-store",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Không thể tải danh sách sản phẩm");
    }
    return data.data;
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  }

  static async createProduct(data: ProductFormData): Promise<Product> {
    const res = await fetch(`${BACKEND_URL}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Không thể tạo sản phẩm");
    }
    return result.data;
  }

  static async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Không thể cập nhật sản phẩm");
    }
    return result.data;
  }

  static async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const result = await res.json();
    if (!result.success) {
      throw new Error(result.message || "Không thể xóa sản phẩm");
    }
  }
}
