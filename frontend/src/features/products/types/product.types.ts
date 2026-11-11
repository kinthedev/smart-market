export interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  order?: number;
}

export interface ProductVariant {
  id?: string;
  size?: string | null;
  color?: string | null;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    products: number;
  };
}

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  categoryId?: string | null;
  category?: Category | null;
  status: ProductStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  ratingAvg?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  sku: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  categoryId?: string;
  status: ProductStatus;
  images: Array<{ url: string; altText?: string; order?: number }>;
  variants: Array<{ size?: string; color?: string; stock: number }>;
}

export interface ProductListResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
