import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { validateRequest } from "../../middlewares/validate-request.js"
import { InventoryController } from "./inventory.controller.js"
import { UpdateStockSchema } from "./inventory.schema.js"

const router = Router()

router.get("/inventory", authenticate, InventoryController.getAll)
router.patch(
	"/inventory/variants/:id",
	authenticate,
	validateRequest(UpdateStockSchema),
	InventoryController.updateStock,
)

export { router as inventoryRouter }
