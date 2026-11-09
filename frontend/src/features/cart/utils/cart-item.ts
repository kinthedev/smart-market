import type { Product as CatalogProduct } from "@/src/features/products/types/product.types";
import type { Product as MockProduct } from "@/src/data-seed/shop-data";
import type { AddCartItemInput } from "../types";

export type CartProduct = CatalogProduct | MockProduct;

/**
 * Chuyển dữ liệu sản phẩm (từ DB hoặc dữ liệu flash-sale) sang dữ liệu giỏ hàng.
 */
export function buildCartItem(product: CartProduct): AddCartItemInput {
  if ("images" in product) {
    const hasSalePrice =
      product.salePrice != null && product.salePrice < product.price;

    return {
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url,
      price: hasSalePrice ? (product.salePrice as number) : product.price,
      originalPrice: hasSalePrice ? product.price : undefined,
      quantity: 1,
    };
  }

  return {
    productId: String(product.id),
    name: product.name,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    quantity: 1,
  };
}
