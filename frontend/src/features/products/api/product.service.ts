import type {
  Product,
  Category,
  ProductFormData,
  ProductListResponse,
} from "../types/product.types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

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
  }): Promise<ProductListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.status) query.set("status", params.status);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/products?${query.toString()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      return data.success
        ? data.data
        : { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    } catch {
      return { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    }
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
