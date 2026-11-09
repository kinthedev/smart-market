import { Router } from "express"
import {
	authenticate,
	optionalAuthenticate,
} from "../../middlewares/authenticate.js"
import { validateRequest } from "../../middlewares/validate-request.js"
import { ReviewController } from "./review.controller.js"
import { CreateReviewSchema, UpdateReviewSchema } from "./review.schema.js"

const router = Router()

router.get("/products/:productId/reviews", ReviewController.getReviews)
router.get(
	"/products/:productId/reviews/summary",
	optionalAuthenticate,
	ReviewController.getSummary,
)
router.post(
	"/products/:productId/reviews",
	authenticate,
	validateRequest(CreateReviewSchema),
	ReviewController.createReview,
)

router.get("/admin/reviews", authenticate, ReviewController.getAllReviews)
router.put(
	"/reviews/:id",
	authenticate,
	validateRequest(UpdateReviewSchema),
	ReviewController.updateReview,
)
router.delete("/reviews/:id", authenticate, ReviewController.deleteReview)
router.patch("/reviews/:id/hide", authenticate, ReviewController.setHidden)

export { router as reviewRouter }
