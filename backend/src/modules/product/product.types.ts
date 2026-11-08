export interface CreateProductInput {
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  categoryId?: string | null;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  images?: Array<{
    url: string;
    altText?: string;
    order?: number;
  }>;
  variants?: Array<{
    size?: string;
    color?: string;
    stock?: number;
  }>;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductQueryFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
}
