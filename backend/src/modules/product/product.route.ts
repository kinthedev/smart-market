import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

// Public routes (khách xem sản phẩm & danh mục)
router.get("/categories", ProductController.getCategories);
router.get("/products", ProductController.getProducts);
router.get("/products/:id", ProductController.getProductById);

// Admin-only routes
router.post("/categories", authenticate, ProductController.createCategory);
router.post("/products", authenticate, ProductController.createProduct);
router.put("/products/:id", authenticate, ProductController.updateProduct);
router.delete("/products/:id", authenticate, ProductController.deleteProduct);

export { router as productRouter };
