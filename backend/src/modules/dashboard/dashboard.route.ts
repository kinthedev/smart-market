import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { DashboardController } from "./dashboard.controller.js"

const router = Router()

router.get("/dashboard/overview", authenticate, DashboardController.getOverview)

export { router as dashboardRouter }
