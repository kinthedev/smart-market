import { Router } from "express";
import { CustomerController } from "./customer.controller.js";
import { authenticate } from "../../middlewares/authenticate.js";

const router = Router();

// Toàn bộ các tác vụ quản lý khách hàng đều cần quyền Admin đã đăng nhập
router.get("/customers", authenticate, CustomerController.getCustomers);
router.get("/customers/:id", authenticate, CustomerController.getCustomerById);
router.post("/customers", authenticate, CustomerController.createCustomer);
router.put("/customers/:id", authenticate, CustomerController.updateCustomer);
router.patch("/customers/:id/toggle-status", authenticate, CustomerController.toggleStatus);
router.delete("/customers/:id", authenticate, CustomerController.deleteCustomer);

export { router as customerRouter };
