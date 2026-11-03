# Kế hoạch & Kịch bản Kiểm thử: Module Authentication (Test Cases)

> **Module:** 01 - Authentication & Session Management  
> **Mục tiêu:** Đảm bảo toàn bộ luồng đăng ký (Signup) và đăng nhập (Login) hoạt động chính xác, dữ liệu được bảo vệ an toàn và xử lý lỗi mượt mà.  
> **Phương pháp:** Manual Testing kết hợp Automated Integration Tests (Vitest / Playwright).

---

## 1. Ma trận Kịch bản Kiểm thử (Test Cases Matrix) - Tính năng Đăng Ký (Signup)

### 1.1. Luồng thành công (Happy Path)

| Mã Test | Mô tả ca kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Đăng ký thành công với thông tin hợp lệ | - Name: `"Nguyễn Văn A"`<br/>- Email: `"user_valid@example.com"`<br/>- Password: `"Password123@"`<br/>- Confirm: `"Password123@"` | - Không hiển thị lỗi nào.<br/>- DB có bản ghi mới trong `user`, `account`, `session`.<br/>- Trình duyệt lưu cookie session.<br/>- Tự động chuyển hướng về trang chủ `/`. | ✅ PASS |

---

### 1.2. Kiểm thử Xác thực Dữ liệu Đầu vào (Client Validation Tests)

| Mã Test | Mô tả ca kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-AUTH-02** | Để trống toàn bộ các trường | Bấm "Create Account" khi form trắng | Báo lỗi đỏ dưới cả 4 ô input, form không gửi request lên server. | ✅ PASS |
| **TC-AUTH-03** | Họ tên quá ngắn (< 2 ký tự) | Name: `"A"` | Báo lỗi: *"Họ và tên phải có ít nhất 2 ký tự"*. | ✅ PASS |
| **TC-AUTH-04** | Họ tên chỉ toàn dấu cách | Name: `"     "` | Zod `.trim()` xử lý thành rỗng $\rightarrow$ Báo lỗi họ tên tối thiểu 2 ký tự. | ✅ PASS |
| **TC-AUTH-05** | Email sai định dạng (Thiếu `@`) | Email: `"invalidemail.com"` | Báo lỗi: *"Địa chỉ email không hợp lệ"*. | ✅ PASS |
| **TC-AUTH-06** | Email sai định dạng (Thiếu domain) | Email: `"test@"` | Báo lỗi: *"Địa chỉ email không hợp lệ"*. | ✅ PASS |
| **TC-AUTH-07** | Mật khẩu quá ngắn (< 8 ký tự) | Password: `"1234567"` | Báo lỗi: *"Mật khẩu phải có ít nhất 8 ký tự"*. | ✅ PASS |
| **TC-AUTH-08** | Mật khẩu xác nhận không trùng khớp | - Password: `"Password123@"`<br/>- Confirm: `"Password999@"` | Báo lỗi: *"Mật khẩu xác nhận không trùng khớp"*. | ✅ PASS |

---

### 1.3. Kiểm thử Nghiệp vụ & Lỗi Máy chủ (Server & Negative Tests)

| Mã Test | Mô tả ca kiểm thử | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-AUTH-09** | Đăng ký bằng Email đã tồn tại | Email đã có sẵn trong bảng `user` | - Server trả về lỗi `422 Unprocessable Entity`.<br/>- Form hiển thị banner cảnh báo: *"User already exists with this email"*. | ✅ PASS |
| **TC-AUTH-10** | Ngăn chặn Double Submit khi spam click | Click liên tục vào nút "Create Account" | Nút bấm lập tức chuyển sang trạng thái `disabled` kèm chữ `"Creating Account..."`, chỉ duy nhất 1 request được gửi đi. | ✅ PASS |
| **TC-AUTH-11** | Mất kết nối tới Backend | Tắt Backend Server và bấm Đăng ký | Form bắt được ngoại lệ mạng, hiển thị thông báo lỗi: *"Đã xảy ra lỗi kết nối đến máy chủ"*. | ✅ PASS |

---

### 1.4. Kiểm thử Bảo mật Cơ sở Dữ liệu (Database Verification)

| Mã Test | Mô tả ca kiểm thử | Thao tác kiểm tra | Tiêu chuẩn đánh giá | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-AUTH-12** | Mật khẩu không bao giờ được lưu dạng Plaintext | Mở bảng `account` trong DB xem giá trị cột `password` | Cột `password` phải là chuỗi hash bắt đầu dạng `$scrypt$...` hoặc tương tự. Tuyệt đối không được thấy mật khẩu gốc. | ✅ PASS |
| **TC-AUTH-13** | Xóa User tự động dọn dẹp các bảng phụ (Cascade) | Xóa 1 bản ghi `user` qua Prisma Studio | Toàn bộ bản ghi liên quan trong bảng `account` và `session` của user đó phải tự động bị xóa sạch. | ✅ PASS |

---

## 2. Tiêu chí Nghiệm thu (Acceptance Criteria - Definition of Done)

Tính năng Đăng ký chỉ được coi là hoàn thành (Done) khi đáp ứng đủ 5 điều kiện sau:

- [x] Đã cấu hình Zod schema validate chặt chẽ ở cả Frontend và Backend.
- [x] Giao diện hiển thị lỗi trực quan, phản hồi tức thì khi người dùng gõ phím.
- [x] Mật khẩu được mã hóa an toàn trước khi ghi vào PostgreSQL.
- [x] Đăng ký thành công tự động đăng nhập và sinh Cookie phiên làm việc.
- [x] Đã kiểm thử thành công trên cả môi trường Localhost và môi trường Production Vercel/Render.
