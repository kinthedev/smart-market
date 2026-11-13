import { Router } from "express";
import { CustomerController } from "./customer.controller.js";
import { authenticate, requireAdmin } from "../../middlewares/authenticate.js";

const router = Router();

// Toàn bộ các tác vụ quản lý khách hàng đều cần quyền Admin đã đăng nhập
router.use(authenticate, requireAdmin);
router.get("/customers", CustomerController.getCustomers);
router.get("/customers/:id", CustomerController.getCustomerById);
router.post("/customers", CustomerController.createCustomer);
router.put("/customers/:id", CustomerController.updateCustomer);
router.patch("/customers/:id/toggle-status", CustomerController.toggleStatus);
router.delete("/customers/:id", CustomerController.deleteCustomer);

export { router as customerRouter };
