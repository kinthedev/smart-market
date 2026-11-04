import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

const isProduction = process.env.NODE_ENV === "production";
const backendUrl = process.env.BETTER_AUTH_URL || "http://localhost:4000";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

const requiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const facebookClientId =
  process.env.FACEBOOK_CLIENT_ID || process.env.FACEBOOK_APP_ID;

// Danh sách origin được phép truy cập
const trustedOrigins = [
  frontendUrl,
  "http://localhost:3000",
].filter(Boolean) as string[];

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
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
    },
  },
});
