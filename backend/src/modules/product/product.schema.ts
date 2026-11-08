import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const CreateProductSchema = z.object({
  sku: z.string().min(1, "Mã sản phẩm (SKU) không được để trống"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Giá bán không được nhỏ hơn 0"),
  salePrice: z.number().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional().default("ACTIVE"),
  images: z.array(
    z.object({
      url: z.string().min(1, "Đường dẫn hình ảnh không được để trống"),
      altText: z.string().optional(),
      order: z.number().optional().default(0),
    })
  ).optional().default([]),
  variants: z.array(
    z.object({
      size: z.string().optional(),
      color: z.string().optional(),
      stock: z.number().min(0).optional().default(0),
    })
  ).optional().default([]),
});

export const UpdateProductSchema = CreateProductSchema.partial();
