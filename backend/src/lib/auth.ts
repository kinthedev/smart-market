import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

const isProduction = process.env.NODE_ENV === "production";

// Danh sách origin được phép truy cập
const trustedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean) as string[];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins: [
    ...trustedOrigins,
    "https://*.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: isProduction,
    defaultCookieAttributes: {
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    },
  },
});
