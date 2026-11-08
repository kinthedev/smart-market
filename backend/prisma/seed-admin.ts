import "dotenv/config";
import { syncAdminAccount } from "../src/lib/admin-sync.js";
import { prisma } from "../src/lib/prisma.js";

/**
 * Đồng bộ tài khoản admin từ ADMIN_EMAIL / ADMIN_PASSWORD vào database.
 *
 * Thông thường không cần chạy tay: backend đã tự gọi hàm này mỗi lần khởi động.
 * Lệnh này hữu ích khi muốn cập nhật ngay mật khẩu admin mà không restart server.
 */
syncAdminAccount()
  .then(() => {
    console.log("✅ Đồng bộ tài khoản admin hoàn tất.");
  })
  .catch((error) => {
    console.error("❌ Không thể đồng bộ tài khoản admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
