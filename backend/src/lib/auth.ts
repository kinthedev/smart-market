import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

// Chuẩn hoá URL (bỏ dấu "/" ở cuối) để tránh sai lệch origin/callback.
const normalizeUrl = (url: string) => url.replace(/\/+$/, "");

const rawBackendUrl = process.env.BETTER_AUTH_URL;
const rawFrontendUrl = process.env.FRONTEND_URL;

// Production nếu NODE_ENV=production hoặc backend chạy bằng HTTPS.
// Cách này tránh trường hợp Render không set NODE_ENV khiến cookie bị sai thuộc tính.
const isProduction =
  process.env.NODE_ENV === "production" ||
  Boolean(rawBackendUrl?.startsWith("https://"));

// Ở production, bắt buộc phải khai báo URL thật trong .env.
// Tuyệt đối không fallback về localhost để tránh Google OAuth redirect sai môi trường.
if (isProduction && !rawBackendUrl) {
  throw new Error("Missing required environment variable: BETTER_AUTH_URL");
}
if (isProduction && !rawFrontendUrl) {
  throw new Error("Missing required environment variable: FRONTEND_URL");
}

const backendUrl = normalizeUrl(rawBackendUrl || "http://localhost:4000");
const frontendUrl = normalizeUrl(rawFrontendUrl || "http://localhost:3000");

const requiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const facebookClientId =
  process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_APP_ID;

// Danh sách origin được phép truy cập.
// Production chỉ tin tưởng FRONTEND_URL trong .env, không thêm localhost.
const trustedOrigins = Array.from(
  new Set(
    isProduction
      ? [frontendUrl]
      : [frontendUrl, "http://localhost:3000"],
  ),
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: requiredEnv("BETTER_AUTH_SECRET", process.env.BETTER_AUTH_SECRET),
  baseURL: backendUrl,
  trustedOrigins: [
    ...trustedOrigins,
    "https://*.vercel.app",
  ],
  socialProviders: {
    google: {
      clientId: requiredEnv("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID),
      clientSecret: requiredEnv(
        "GOOGLE_CLIENT_SECRET",
        process.env.GOOGLE_CLIENT_SECRET,
      ),
      // Cho phép đăng ký tự động khi email OAuth chưa tồn tại.
      disableImplicitSignUp: false,
    },
    facebook: {
      clientId: requiredEnv(
        "FACEBOOK_CLIENT_ID or FACEBOOK_APP_ID",
        facebookClientId,
      ),
      clientSecret: requiredEnv(
        "FACEBOOK_CLIENT_SECRET",
        process.env.FACEBOOK_CLIENT_SECRET,
      ),
      // Cho phép đăng ký tự động khi email OAuth chưa tồn tại.
      disableImplicitSignUp: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      // Không tự động nối Google/Facebook vào tài khoản tạo bằng mật khẩu.
      // Người dùng phải đăng nhập bằng email/mật khẩu hoặc chủ động link account.
      disableImplicitLinking: true,
    },
  },
  advanced: {
    useSecureCookies: isProduction,
    // Frontend (Vercel) và Backend (Render) nằm ở 2 domain khác nhau.
    // Cookie phải là SameSite=None + Secure thì trình duyệt mới lưu và gửi lại
    // cookie OAuth state trong luồng Google/Facebook callback (cross-site).
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
    },
    // Render truyền IP client qua X-Forwarded-For, giúp rate limit hoạt động đúng.
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
});
