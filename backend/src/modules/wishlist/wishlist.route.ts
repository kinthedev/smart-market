import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { WishlistController } from "./wishlist.controller.js"

const router = Router()

router.get("/wishlist", authenticate, WishlistController.getWishlist)
router.get("/wishlist/ids", authenticate, WishlistController.getIds)
router.post("/wishlist/:productId", authenticate, WishlistController.add)
router.delete("/wishlist/:productId", authenticate, WishlistController.remove)

export { router as wishlistRouter }
