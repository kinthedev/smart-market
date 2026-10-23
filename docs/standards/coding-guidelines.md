# Quy Chuẩn Code & Git Conventions

## 1. Đặt tên API
- Đường dẫn dùng danh từ số nhiều, chữ thường, cách nhau bằng dấu gạch ngang (`kebab-case`).
  - ✅ Đúng: `/api/v1/order-items`
  - ❌ Sai: `/api/v1/getorderitems` hoặc `/api/v1/order_items`

## 2. Quy tắc Commit Git (Conventional Commits)
Format: `<type>(<scope>): <description>`

- `feat`: Tính năng mới (ví dụ: `feat(cart): add item to cart API`)
- `fix`: Sửa lỗi (ví dụ: `fix(checkout): fix total price calculation error`)
- `docs`: Cập nhật tài liệu (ví dụ: `docs(api): update checkout endpoints`)
- `refactor`: Sửa code nhưng không đổi logic/tính năng

## 3. Xử lý Lỗi API (Error Response Standard)
Mọi API khi gặp lỗi phải trả về đúng chuẩn JSON sau:
```json
{
  "success": false,
  "code": "PRODUCT_OUT_OF_STOCK",
  "message": "Sản phẩm này hiện đã hết hàng trong kho."
}