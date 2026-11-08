import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { productRouter } from "./modules/product/product.route.js";
import { customerRouter } from "./modules/customer/customer.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const app = express();

// 1. Cấu hình Trust Proxy (Bắt buộc khi deploy Render / reverse proxy để nhận diện HTTPS và set cookie)
app.set("trust proxy", 1);

// 2. CORS Configuration hỗ trợ cả Localhost và Vercel Production / Preview URLs
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  process.env.FRONTEND_URL,
  // Chỉ cho phép localhost khi chạy ở môi trường development.
  ...(isProduction ? [] : ["http://localhost:3000"]),
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (ví dụ: mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true);

      // Cho phép origin nằm trong danh sách hoặc domain vercel.app
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// 3. Mount Better Auth handler TRƯỚC express.json() để không bị consume request stream
app.all("/api/auth/*splat", toNodeHandler(auth));
app.all("/api/auth", toNodeHandler(auth));

// 4. Body parsers cho các route API thông thường
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Health check endpoint (phục vụ Render health check)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Market Backend API is healthy",
    environment: process.env.NODE_ENV || "development",
  });
});

// 6. API v1 Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", customerRouter);

// 7. 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
