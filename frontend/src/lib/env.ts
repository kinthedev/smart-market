/**
 * Quản lý tập trung các biến môi trường phía client
 */
const browserOrigin =
  typeof window !== "undefined" ? window.location.origin : undefined;

export const env = {
  BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  // URL công khai của Frontend, dùng cho callback OAuth (Google/Facebook).
  // Ở production hãy khai báo NEXT_PUBLIC_FRONTEND_URL trong .env.
  // Nếu chưa khai báo, fallback về origin hiện tại của trình duyệt (không dùng localhost).
  FRONTEND_URL:
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    browserOrigin ||
    "http://localhost:3000",
} as const;

