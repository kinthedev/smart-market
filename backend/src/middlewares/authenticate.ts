import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../modules/auth/auth.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionData = await AuthService.getSession(req.headers);
    if (!sessionData) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHORIZED",
        message: "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.",
      });
    }

    req.user = sessionData.user;
    req.session = sessionData.session;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Xác thực không hợp lệ.",
    });
  }
}

