import { Router } from "express"
import { authenticate } from "../../middlewares/authenticate.js"
import { validateRequest } from "../../middlewares/validate-request.js"
import { CommentController } from "./comment.controller.js"
import { CreateCommentSchema, UpdateCommentSchema } from "./comment.schema.js"

const router = Router()

router.get("/products/:productId/comments", CommentController.getComments)
router.post(
	"/products/:productId/comments",
	authenticate,
	validateRequest(CreateCommentSchema),
	CommentController.createComment,
)

router.get("/admin/comments", authenticate, CommentController.getAllComments)
router.put(
	"/comments/:id",
	authenticate,
	validateRequest(UpdateCommentSchema),
	CommentController.updateComment,
)
router.delete("/comments/:id", authenticate, CommentController.deleteComment)
router.patch("/comments/:id/hide", authenticate, CommentController.setHidden)

export { router as commentRouter }
