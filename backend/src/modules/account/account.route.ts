import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { validateRequest } from "../../middlewares/validate-request.js"
import { AccountController } from "./account.controller.js"
import {
	CreateShippingAddressSchema,
	UpdateShippingAddressSchema,
} from "./account.schema.js"

const router = Router()

// Sổ địa chỉ người nhận của khách hàng đang đăng nhập.
router.get("/account/addresses", authenticate, AccountController.getAddresses)
router.get(
	"/account/addresses/default",
	authenticate,
	AccountController.getDefaultAddress,
)
router.post(
	"/account/addresses",
	authenticate,
	validateRequest(CreateShippingAddressSchema),
	AccountController.createAddress,
)
router.put(
	"/account/addresses/:id",
	authenticate,
	validateRequest(UpdateShippingAddressSchema),
	AccountController.updateAddress,
)
router.delete(
	"/account/addresses/:id",
	authenticate,
	AccountController.deleteAddress,
)
router.patch(
	"/account/addresses/:id/default",
	authenticate,
	AccountController.setDefaultAddress,
)

export { router as accountRouter }
