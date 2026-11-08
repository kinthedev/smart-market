-- Thêm cột role để phân biệt tài khoản user / admin
ALTER TABLE "user" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
