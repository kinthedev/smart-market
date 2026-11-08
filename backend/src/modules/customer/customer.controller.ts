import type { Request, Response } from "express";
import { isAdminEmail } from "../../lib/admin.js";
import { CustomerService } from "./customer.service.js";

export class CustomerController {
  static async getCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getCustomers(req.query as any);
      return res.status(200).json({ success: true, data: customers });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const customer = await CustomerService.getCustomerById(req.params.id as string);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng." });
      }
      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!isAdminEmail(user?.email)) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const created = await CustomerService.createCustomer(req.body);
      return res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!isAdminEmail(user?.email)) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const updated = await CustomerService.updateCustomer(req.params.id as string, req.body);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!isAdminEmail(user?.email)) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      await CustomerService.deleteCustomer(req.params.id as string);
      return res.status(200).json({ success: true, message: "Đã xóa khách hàng thành công khỏi cơ sở dữ liệu." });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async toggleStatus(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!isAdminEmail(user?.email)) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const updated = await CustomerService.toggleStatus(req.params.id as string);
      return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
