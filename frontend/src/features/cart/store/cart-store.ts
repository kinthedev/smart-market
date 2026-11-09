"use client";

import type { AddCartItemInput, CartItem } from "../types";

const STORAGE_KEY = "smartmarket_cart_v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Bỏ qua lỗi lưu trữ (chế độ riêng tư, hết dung lượng...)
  }
}

function makeKey(input: { productId: string; size?: string; color?: string }) {
  return `${input.productId}__${input.size ?? ""}__${input.color ?? ""}`;
}

/** Nạp giỏ hàng đã lưu trong localStorage (chỉ chạy 1 lần ở client). */
export function hydrateCart() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (item): item is CartItem =>
          Boolean(item) &&
          typeof item.productId === "string" &&
          typeof item.name === "string" &&
          typeof item.price === "number" &&
          typeof item.quantity === "number"
      );
      emit();
    }
  } catch {
    // Dữ liệu hỏng -> bỏ qua và dùng giỏ rỗng
  }
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot() {
  return items;
}

export function getCartServerSnapshot() {
  return EMPTY;
}

export function addCartItem(input: AddCartItemInput) {
  hydrateCart();

  const key = makeKey(input);
  const quantity = Math.max(1, Math.min(99, input.quantity ?? 1));
  const exists = items.some((item) => item.key === key);

  if (exists) {
    items = items.map((item) =>
      item.key === key
        ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
        : item
    );
  } else {
    items = [...items, { ...input, key, quantity }];
  }

  persist();
  emit();
}

export function updateCartQuantity(key: string, quantity: number) {
  const next = Math.max(1, Math.min(99, quantity));
  items = items.map((item) =>
    item.key === key ? { ...item, quantity: next } : item
  );
  persist();
  emit();
}

export function removeCartItem(key: string) {
  items = items.filter((item) => item.key !== key);
  persist();
  emit();
}

export function clearCart() {
  items = EMPTY;
  persist();
  emit();
}
