/**
 * Quản lý tập trung các biến môi trường phía client
 * Hỗ trợ 2 lựa chọn: Môi trường Development (Localhost) và Production (Vercel & Render)
 */
const browserOrigin =
  typeof window !== "undefined" ? window.location.origin : undefined;

const isProduction =
  process.env.NODE_ENV === "production" ||
  Boolean(browserOrigin && !browserOrigin.includes("localhost") && !browserOrigin.includes("127.0.0.1"));

const DEFAULT_PROD_BACKEND_URL = "https://smart-market-zogb.onrender.com";
const DEFAULT_DEV_BACKEND_URL = "http://localhost:4000";

const DEFAULT_PROD_FRONTEND_URL = "https://smart-market-theta.vercel.app";
const DEFAULT_DEV_FRONTEND_URL = "http://localhost:3000";

export const env = {
  BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (isProduction ? DEFAULT_PROD_BACKEND_URL : DEFAULT_DEV_BACKEND_URL),
  // URL công khai của Frontend, dùng cho callback OAuth (Google/Facebook).
  FRONTEND_URL:
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    browserOrigin ||
    (isProduction ? DEFAULT_PROD_FRONTEND_URL : DEFAULT_DEV_FRONTEND_URL),
} as const;
