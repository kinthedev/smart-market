import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

// Lấy thông tin user hiện tại (yêu cầu đăng nhập)
router.get("/me", authenticate, AuthController.getMe);

export { router as authRouter };

