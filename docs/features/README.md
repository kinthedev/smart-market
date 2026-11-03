# Danh mục Quản lý Tính năng Hệ thống (Feature Matrix)

> **Tài liệu theo dõi tiến độ phát triển và danh mục đặc tả kỹ thuật cho từng module nghiệp vụ trong dự án SmartMarket.**

---

## 1. Bảng Trạng thái Tính năng (Feature Tracking Table)

| STT | Mã Module | Tên Tính năng | Mô tả Nghiệp vụ | Trạng thái | Tài liệu chi tiết |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **01** | `AUTH` | **Xác thực & Quản lý Phiên** | Đăng ký, Đăng nhập, Đăng xuất, Session đa thiết bị (Lab 01) | ✅ **Completed** | [📂 Xem Docs](./01-auth/README.md) |
| **02** | `SHOP` | **Quản lý Gian hàng (Multi-vendor)** | Đăng ký shop, cấu hình cửa hàng, phân quyền chủ shop/nhân viên (Lab 02) | 📝 *Planning* | *Sắp triển khai* |
| **03** | `PRODUCT` | **Sản phẩm & Danh mục** | Quản lý sản phẩm, biến thể (màu sắc/size), danh mục cha/con, tìm kiếm | 📝 *Planning* | *Sắp triển khai* |
| **04** | `CART` | **Giỏ hàng Thông minh** | Giỏ hàng gom nhóm theo từng shop, cập nhật số lượng thời gian thực | 📝 *Planning* | *Sắp triển khai* |
| **05** | `INVENTORY` | **Tồn kho & Xử lý Đồng thời** | Quản lý kho hàng, giữ hàng tạm thời, giải quyết Race Condition (Lab 03 & 04) | 📝 *Planning* | *Sắp triển khai* |
| **06** | `ORDER` | **Đơn hàng & State Machine** | Đặt hàng, vòng đời đơn hàng (Pending $\rightarrow$ Confirmed $\rightarrow$ Shipped $\rightarrow$ Delivered) | 📝 *Planning* | *Sắp triển khai* |
| **07** | `PAYMENT` | **Thanh toán & Idempotency** | Tích hợp cổng thanh toán Sandbox, xử lý chống thanh toán trùng lặp (Lab 05) | 📝 *Planning* | *Sắp triển khai* |
| **08** | `RECOMMEND` | **Hệ thống Gợi ý Cá nhân hóa** | Thu thập hành vi, thuật toán Collaborative Filtering & Content-Based | 🔬 *Research* | *Sắp triển khai* |

---

## 2. Tiêu chuẩn viết Tài liệu cho mỗi Feature Mới

Khi triển khai bất kỳ module tính năng mới nào (ví dụ `02-products`, `03-cart`), cần khởi tạo thư mục `docs/features/<mã-module>/` tuân theo chuẩn 5-6 file độc lập:

1. **`README.md`**: Giới thiệu mục tiêu, sơ đồ kiến trúc và các quyết định kỹ thuật của module.
2. **`<feature>-spec.md`**: Đặc tả nghiệp vụ chi tiết, user stories, validation rules, sequence diagram.
3. **`data-model.md`**: Thiết kế ERD, cấu trúc bảng CSDL, quan hệ khóa ngoại và chỉ mục index.
4. **`api-spec.md`**: Đặc tả chi tiết từng endpoint API (URL, Request Body, Response, HTTP status).
5. **`test-cases.md`**: Bảng kịch bản kiểm thử (Happy path, Negative cases, Edge cases).
6. **`security.md`** *(nếu có)*: Các giải pháp bảo mật hoặc bài lab Software Engineering liên quan.

