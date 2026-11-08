import { ADMIN_EMAIL } from "../../lib/admin.js";
import { prisma } from "../../lib/prisma.js";

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  province?: string;
  district?: string;
  ward?: string;
  addressDetail?: string;
  status?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}

export class CustomerService {
  static async getCustomers(query?: { search?: string; status?: string }) {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query?.status && query.status !== "Tất cả") {
      where.status = query.status;
    }

    // Lọc bỏ tài khoản admin ra khỏi danh sách khách hàng
    where.email = { not: ADMIN_EMAIL };

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return users.map((u, idx) => ({
      id: u.id,
      code: `KH-${String(idx + 1).padStart(3, "0")}`,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      avatar: u.image || undefined,
      registeredAt: u.createdAt.toISOString().split("T")[0],
      status: (u.status as "Hoạt động" | "Bị khóa") || "Hoạt động",
      totalOrders: 0,
      totalSpent: 0,
      gender: (u.gender as "Nam" | "Nữ" | "Khác") || "Nam",
      dateOfBirth: u.dateOfBirth || "",
      province: u.province || "",
      district: u.district || "",
      ward: u.ward || "",
      addressDetail: u.addressDetail || "",
      orderHistory: [],
    }));
  }

  static async getCustomerById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;

    return {
      id: user.id,
      code: `KH-${user.id.slice(0, 4).toUpperCase()}`,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.image || undefined,
      registeredAt: user.createdAt.toISOString().split("T")[0],
      status: (user.status as "Hoạt động" | "Bị khóa") || "Hoạt động",
      totalOrders: 0,
      totalSpent: 0,
      gender: (user.gender as "Nam" | "Nữ" | "Khác") || "Nam",
      dateOfBirth: user.dateOfBirth || "",
      province: user.province || "",
      district: user.district || "",
      ward: user.ward || "",
      addressDetail: user.addressDetail || "",
      orderHistory: [],
    };
  }

  static async createCustomer(data: CreateCustomerInput) {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error("Email này đã được sử dụng bởi một tài khoản khác.");
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        province: data.province,
        district: data.district,
        ward: data.ward,
        addressDetail: data.addressDetail,
        status: data.status || "Hoạt động",
        emailVerified: false,
      },
    });

    return {
      id: newUser.id,
      code: `KH-${newUser.id.slice(0, 4).toUpperCase()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || "",
      avatar: newUser.image || undefined,
      registeredAt: newUser.createdAt.toISOString().split("T")[0],
      status: (newUser.status as "Hoạt động" | "Bị khóa") || "Hoạt động",
      totalOrders: 0,
      totalSpent: 0,
      gender: (newUser.gender as "Nam" | "Nữ" | "Khác") || "Nam",
      dateOfBirth: newUser.dateOfBirth || "",
      province: newUser.province || "",
      district: newUser.district || "",
      ward: newUser.ward || "",
      addressDetail: newUser.addressDetail || "",
      orderHistory: [],
    };
  }

  static async updateCustomer(id: string, data: UpdateCustomerInput) {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        province: data.province,
        district: data.district,
        ward: data.ward,
        addressDetail: data.addressDetail,
        status: data.status,
      },
    });

    return {
      id: updated.id,
      code: `KH-${updated.id.slice(0, 4).toUpperCase()}`,
      name: updated.name,
      email: updated.email,
      phone: updated.phone || "",
      avatar: updated.image || undefined,
      registeredAt: updated.createdAt.toISOString().split("T")[0],
      status: (updated.status as "Hoạt động" | "Bị khóa") || "Hoạt động",
      totalOrders: 0,
      totalSpent: 0,
      gender: (updated.gender as "Nam" | "Nữ" | "Khác") || "Nam",
      dateOfBirth: updated.dateOfBirth || "",
      province: updated.province || "",
      district: updated.district || "",
      ward: updated.ward || "",
      addressDetail: updated.addressDetail || "",
      orderHistory: [],
    };
  }

  static async deleteCustomer(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async toggleStatus(id: string) {
    const current = await prisma.user.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current) throw new Error("Không tìm thấy khách hàng");

    const nextStatus = current.status === "Hoạt động" ? "Bị khóa" : "Hoạt động";
    return prisma.user.update({
      where: { id },
      data: { status: nextStatus },
    });
  }
}
