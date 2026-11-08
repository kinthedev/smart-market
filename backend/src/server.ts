import { app } from "./app.js";
import { syncAdminAccount } from "./lib/admin-sync.js";

const PORT = Number(process.env.PORT) || 4000;

async function bootstrap() {
  // Đồng bộ tài khoản admin từ ADMIN_EMAIL / ADMIN_PASSWORD mỗi lần khởi động.
  // Nhờ vậy chỉ cần đổi biến môi trường trên Render rồi restart là xong.
  try {
    await syncAdminAccount();
  } catch (error) {
    console.error(
      "[admin] Không thể đồng bộ tài khoản admin từ biến môi trường:",
      error,
    );
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

bootstrap();
