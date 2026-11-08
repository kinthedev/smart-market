import { prisma } from "../../lib/prisma.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductQueryFilter,
  CreateCategoryInput,
} from "./product.types.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export class ProductService {
  // --- CATEGORIES ---
  static async getCategories() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  static async createCategory(data: CreateCategoryInput) {
    const slug = data.slug || `${slugify(data.name)}-${Date.now()}`;
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
      },
    });
  }

  // --- PRODUCTS ---
  static async getProducts(filter: ProductQueryFilter) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Number(filter.limit) || 20);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { sku: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          variants: true,
        },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        variants: true,
      },
    });
  }

  static async createProduct(data: CreateProductInput) {
    const slug = data.slug || `${slugify(data.name)}-${Date.now()}`;

    return prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        categoryId: data.categoryId,
        status: data.status || "ACTIVE",
        images: data.images?.length
          ? {
              create: data.images.map((img, idx) => ({
                url: img.url,
                altText: img.altText || data.name,
                order: img.order ?? idx,
              })),
            }
          : undefined,
        variants: data.variants?.length
          ? {
              create: data.variants.map((v) => ({
                size: v.size,
                color: v.color,
                stock: v.stock ?? 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        variants: true,
      },
    });
  }

  static async updateProduct(id: string, data: UpdateProductInput) {
    // Nếu cập nhật images hoặc variants, ta thực hiện trong transaction để đồng bộ
    return prisma.$transaction(async (tx) => {
      if (data.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img, idx) => ({
              productId: id,
              url: img.url,
              altText: img.altText || data.name,
              order: img.order ?? idx,
            })),
          });
        }
      }

      if (data.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        if (data.variants.length > 0) {
          await tx.productVariant.createMany({
            data: data.variants.map((v) => ({
              productId: id,
              size: v.size,
              color: v.color,
              stock: v.stock ?? 0,
            })),
          });
        }
      }

      const updateData: any = {};
      if (data.sku !== undefined) updateData.sku = data.sku;
      if (data.name !== undefined) {
        updateData.name = data.name;
        if (!data.slug) {
          updateData.slug = `${slugify(data.name)}-${Date.now()}`;
        }
      }
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.salePrice !== undefined) updateData.salePrice = data.salePrice;
      if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
      if (data.status !== undefined) updateData.status = data.status;

      return tx.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          variants: true,
        },
      });
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
