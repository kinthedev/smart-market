import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

const app = express();

// 1. CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 2. Mount Better Auth handler TRƯỚC express.json() để không bị consume request stream
app.all("/api/auth/*splat", toNodeHandler(auth));
app.all("/api/auth", toNodeHandler(auth));

// 3. Body parsers cho các route API thông thường
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Market Backend API running",
  });
});

// 5. API v1 Routes
app.use("/api/v1/auth", authRouter);

// 6. 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

