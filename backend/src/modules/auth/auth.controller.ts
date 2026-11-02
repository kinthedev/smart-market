import type { Request, Response } from "express";

export class AuthController {
  /**
   * GET /api/v1/auth/me
   * Lấy thông tin user hiện tại từ session
   */
  static async getMe(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
        session: req.session,
      },
    });
  }
}

