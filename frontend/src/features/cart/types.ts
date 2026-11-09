export interface CartItem {
  /** Khóa duy nhất theo sản phẩm + phân loại (size/màu) */
  key: string;
  productId: string;
  name: string;
  image?: string;
  /** Giá thực tế đang bán (đã áp dụng khuyến mãi nếu có) */
  price: number;
  /** Giá gốc để hiển thị gạch ngang */
  originalPrice?: number;
  size?: string;
  color?: string;
  quantity: number;
}

export type AddCartItemInput = {
  productId: string;
  name: string;
  image?: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  quantity?: number;
};
