import { prisma } from "../../lib/prisma.js";
import { withProductStats } from "../../lib/product-stats.js";
import { Prisma } from "../../../generated/prisma/client.js";
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
  static async getCategoryBySlug(slug: string) {
    // 1. Tìm chính xác theo slug
    let category = await prisma.category.findUnique({ where: { slug } });
    if (category) return category;

    // 2. Thử tìm theo id (phòng trường hợp URL chứa id)
    category = await prisma.category.findUnique({ where: { id: slug } });
    if (category) return category;

    // 3. Thử tìm tương đối theo tên đã chuẩn hoá (bỏ dấu, thay khoảng trắng bằng '-')
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    const all = await prisma.category.findMany();
    return (
      all.find((c) => normalize(c.name) === slug) ||
      all.find((c) => c.slug.startsWith(`${slug}-`)) ||
      null
    );
  }

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

    if (
      filter.saleType === "regular" ||
      filter.saleType === "discount" ||
      filter.saleType === "flash-sale"
    ) {
      const conditions: Prisma.Sql[] = [];
      const search = typeof filter.search === "string" ? filter.search.trim() : "";

      if (search) {
        const searchTerm = search.toLowerCase();
        conditions.push(
          Prisma.sql`(POSITION(${searchTerm} IN LOWER("name")) > 0 OR POSITION(${searchTerm} IN LOWER("sku")) > 0)`,
        );
      }

      if (typeof filter.categoryId === "string" && filter.categoryId) {
        conditions.push(Prisma.sql`"categoryId" = ${filter.categoryId}`);
      }

      if (typeof filter.status === "string" && filter.status) {
        conditions.push(
          Prisma.sql`"status" = ${filter.status}::"ProductStatus"`,
        );
      }

      if (filter.saleType === "regular") {
        conditions.push(
          Prisma.sql`("salePrice" IS NULL OR "salePrice" >= "price")`,
        );
      } else if (filter.saleType === "discount") {
        conditions.push(
          Prisma.sql`("salePrice" > "price" * 0.5 AND "salePrice" < "price")`,
        );
      } else {
        conditions.push(
          Prisma.sql`("salePrice" >= "price" * 0.1 AND "salePrice" <= "price" * 0.5)`,
        );
      }

      const whereClause = Prisma.join(conditions, " AND ");
      const orderBy =
        filter.sortBy === "price-asc"
          ? Prisma.sql`COALESCE("salePrice", "price") ASC, "createdAt" DESC`
          : Prisma.sql`"createdAt" DESC`;

      const [countRows, orderedIds] = await Promise.all([
        prisma.$queryRaw<Array<{ total: bigint }>>(
          Prisma.sql`SELECT COUNT(*) AS "total" FROM "product" WHERE ${whereClause}`,
        ),
        prisma.$queryRaw<Array<{ id: string }>>(
          Prisma.sql`SELECT "id" FROM "product" WHERE ${whereClause} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${skip}`,
        ),
      ]);
      const ids = orderedIds.map(({ id }) => id);
      const items = ids.length
        ? await prisma.product.findMany({
            where: { id: { in: ids } },
            include: {
              category: true,
              images: { orderBy: { order: "asc" } },
              variants: true,
            },
          })
        : [];
      const itemsById = new Map(items.map((item) => [item.id, item]));

      const orderedItems = ids.flatMap((id) => {
        const item = itemsById.get(id);
        return item ? [item] : [];
      });
      const itemsWithStats = await withProductStats(orderedItems);

      return {
        items: itemsWithStats,
        pagination: {
          page,
          limit,
          total: Number(countRows[0]?.total ?? 0n),
          totalPages: Math.ceil(Number(countRows[0]?.total ?? 0n) / limit),
        },
      };
    }

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

    const orderBy =
      filter.sortBy === "price-asc"
        ? [
            { salePrice: { sort: "asc" as const, nulls: "last" as const } },
            { price: "asc" as const },
          ]
        : { createdAt: "desc" as const };

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
      items: await withProductStats(items),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        variants: true,
      },
    });

    if (!product) return null;

    const [productWithStats] = await withProductStats([product]);
    return productWithStats;
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
