-- Bảng sổ địa chỉ người nhận (mỗi khách hàng có thể lưu nhiều địa chỉ).
-- Dùng IF NOT EXISTS để an toàn khi database đã từng được đồng bộ bằng db push.
CREATE TABLE IF NOT EXISTS "shipping_address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "receiverName" TEXT NOT NULL,
    "receiverPhone" TEXT NOT NULL,
    "provinceId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "addressDetail" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_address_pkey" PRIMARY KEY ("id")
);

-- Chỉ mục tra cứu địa chỉ theo người dùng.
CREATE INDEX IF NOT EXISTS "shipping_address_userId_idx" ON "shipping_address"("userId");

-- Khóa ngoại tới bảng user (xóa user thì xóa luôn địa chỉ).
DO $$ BEGIN
    ALTER TABLE "shipping_address"
        ADD CONSTRAINT "shipping_address_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "user"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
