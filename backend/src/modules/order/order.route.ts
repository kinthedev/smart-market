import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { validateRequest } from "../../middlewares/validate-request.js"
import { OrderController } from "./order.controller.js"
import { CreateOrderSchema } from "./order.schema.js"

const router = Router()

router.post(
	"/orders",
	authenticate,
	validateRequest(CreateOrderSchema),
	OrderController.createOrder,
)
router.get("/orders/my", authenticate, OrderController.getMyOrders)
router.get("/orders", authenticate, OrderController.getAllOrders)
router.patch("/orders/:id/status", authenticate, OrderController.updateStatus)
router.patch("/orders/:id/cancel", authenticate, OrderController.cancelOrder)
router.get("/orders/:id", authenticate, OrderController.getOrderById)

export { router as orderRouter }
