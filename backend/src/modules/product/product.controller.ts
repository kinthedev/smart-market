import type { Request, Response } from "express";
import { ProductService } from "./product.service.js";

const ADMIN_EMAILS = ["admin@smartmarket.com"];

export class ProductController {
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await ProductService.getCategories();
      return res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const category = await ProductService.createCategory(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const result = await ProductService.getProducts(req.query);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(req.params.id as string);
      if (!product) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm." });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const product = await ProductService.createProduct(req.body);
      return res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      const product = await ProductService.updateProduct(req.params.id as string, req.body);
      return res.status(200).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user?.email || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        return res.status(403).json({ success: false, message: "Không có quyền thực hiện thao tác này." });
      }

      await ProductService.deleteProduct(req.params.id as string);
      return res.status(200).json({ success: true, message: "Đã xóa sản phẩm thành công." });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
