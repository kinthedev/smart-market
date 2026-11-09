"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  addCartItem,
  clearCart,
  getCartServerSnapshot,
  getCartSnapshot,
  hydrateCart,
  removeCartItem,
  subscribeCart,
  updateCartQuantity,
} from "../store/cart-store";

export function useCart() {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  useEffect(() => {
    hydrateCart();
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items,
    totalQuantity,
    subtotal,
    addItem: addCartItem,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
    clear: clearCart,
  };
}
