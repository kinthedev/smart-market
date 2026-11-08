-- Quyền admin giờ lấy từ biến môi trường ADMIN_EMAIL, không lưu trong database.
-- Migration này gỡ bỏ cột role (nếu trước đó đã được thêm).
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";
