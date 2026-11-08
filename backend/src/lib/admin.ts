import "dotenv/config";

// Production nếu NODE_ENV=production hoặc backend chạy bằng HTTPS.
const isProduction =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.BETTER_AUTH_URL?.startsWith("https://"));

if (isProduction && !process.env.ADMIN_EMAIL) {
  throw new Error("Missing required environment variable: ADMIN_EMAIL");
}
if (isProduction && !process.env.ADMIN_PASSWORD) {
  throw new Error("Missing required environment variable: ADMIN_PASSWORD");
}

/**
 * Tài khoản admin được cấu hình hoàn toàn từ biến môi trường.
 * Đổi ADMIN_EMAIL / ADMIN_PASSWORD trên Render rồi restart là xong.
 */
export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "admin@smartmarket.com"
)
  .trim()
  .toLowerCase();

export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "admin123!";

export const ADMIN_NAME = process.env.ADMIN_NAME || "Quản trị viên";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}
