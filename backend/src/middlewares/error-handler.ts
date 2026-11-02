import type { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: `Đường dẫn ${req.originalUrl} không tồn tại.`,
  });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("API Error:", err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Đã xảy ra lỗi nội bộ máy chủ.",
  });
}

