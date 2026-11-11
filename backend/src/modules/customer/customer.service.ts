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

type CustomerOrderStatus =
  | "Hoàn thành"
  | "Đang giao"
  | "Đã hủy"
  | "Chờ xác nhận";

const ORDER_STATUS_LABELS: Record<string, CustomerOrderStatus> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Chờ xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

type CustomerOrderRow = {
  id: string;
  code: string;
  status: string;
  total: number;
  receiverPhone: string | null;
  createdAt: Date;
  _count: { items: number };
};

function formatOrderDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/**
 * Chuẩn hoá dữ liệu 1 khách hàng: thông tin cá nhân + thống kê mua hàng thật
 * (tổng đơn, tổng chi tiêu chỉ tính đơn không bị huỷ, lịch sử đơn gần nhất).
 */
function mapCustomer(user: any, orders: CustomerOrderRow[]) {
  const sortedOrders = [...orders].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  const totalOrders = sortedOrders.length;
  const totalSpent = sortedOrders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.total, 0);

  const defaultAddress = user.shippingAddresses?.[0] ?? null;
  const latestOrder = sortedOrders[0] ?? null;

  return {
    id: user.id,
    code: `KH-${user.id.slice(0, 6).toUpperCase()}`,
    name: user.name,
    email: user.email,
    phone: user.phone || defaultAddress?.receiverPhone || latestOrder?.receiverPhone || "",
    avatar: user.image || undefined,
    registeredAt: user.createdAt.toISOString().split("T")[0],
    status: (user.status as "Hoạt động" | "Bị khóa") || "Hoạt động",
    totalOrders,
    totalSpent,
    gender: (user.gender as "Nam" | "Nữ" | "Khác") || "Nam",
    dateOfBirth: user.dateOfBirth || "",
    province: user.province || defaultAddress?.province || "",
    district: user.district || defaultAddress?.district || "",
    ward: user.ward || defaultAddress?.ward || "",
    addressDetail: user.addressDetail || defaultAddress?.addressDetail || "",
    orderHistory: sortedOrders.map((order) => ({
      id: order.id,
      orderCode: order.code,
      date: formatOrderDate(order.createdAt),
      totalAmount: order.total,
      paymentMethod: "COD",
      status: ORDER_STATUS_LABELS[order.status] ?? "Chờ xác nhận",
      itemCount: order._count.items,
    })),
  };
}

const customerOrderSelect = {
  id: true,
  userId: true,
  code: true,
  status: true,
  total: true,
  receiverPhone: true,
  createdAt: true,
  _count: { select: { items: true } },
} as const;

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
      include: {
        shippingAddresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!users.length) return [];

    const userIds = users.map((user) => user.id);
    const orders = await prisma.order.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      select: customerOrderSelect,
    });

    const ordersByUser = new Map<string, CustomerOrderRow[]>();
    for (const order of orders) {
      const current = ordersByUser.get(order.userId as string) ?? [];
      current.push(order as CustomerOrderRow);
      ordersByUser.set(order.userId as string, current);
    }

    return users
      .map((user) => mapCustomer(user, ordersByUser.get(user.id) ?? []))
      .map((customer, idx) => ({
        ...customer,
        // Giữ mã khách hàng dạng tuần tự như trước để dễ đọc
        code: `KH-${String(idx + 1).padStart(3, "0")}`,
      }));
  }

  static async getCustomerById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        shippingAddresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });
    if (!user) return null;

    const orders = await prisma.order.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      select: customerOrderSelect,
    });

    return mapCustomer(user, orders as CustomerOrderRow[]);
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

    return CustomerService.getCustomerById(newUser.id);
  }

  static async updateCustomer(id: string, data: UpdateCustomerInput) {
    await prisma.user.update({
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

    return CustomerService.getCustomerById(id);
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
    await prisma.user.update({
      where: { id },
      data: { status: nextStatus },
    });

    return CustomerService.getCustomerById(id);
  }
}
