/**
 * Quản lý tập trung các biến môi trường phía client
 */
export const env = {
  BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
} as const;

