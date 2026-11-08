import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } from "./admin.js";
import { prisma } from "./prisma.js";

/**
 * Đồng bộ tài khoản admin từ biến môi trường vào database.
 *
 * - Chưa có user: tạo mới với email trong ADMIN_EMAIL.
 * - Đã có user: cập nhật lại mật khẩu theo ADMIN_PASSWORD.
 *
 * Nhờ vậy chỉ cần đổi ADMIN_EMAIL / ADMIN_PASSWORD trên Render rồi restart,
 * không phải sửa trực tiếp database.
 */
export async function syncAdminAccount(): Promise<void> {
  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  let user = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
      },
    });
  } else if (!user.emailVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  }

  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      providerId: "credential",
    },
  });

  if (credentialAccount) {
    await prisma.account.update({
      where: { id: credentialAccount.id },
      data: { password: passwordHash, updatedAt: new Date() },
    });
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  console.log(`[admin] Đã đồng bộ tài khoản admin: ${ADMIN_EMAIL}`);
}
