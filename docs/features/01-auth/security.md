# Phân tích Kỹ thuật & Bảo mật: Module Authentication (Security & Lab 01)

> **Module:** 01 - Authentication & Session Management  
> **Nội dung:** Kiến trúc bảo mật, lưu trữ mật khẩu, quản lý phiên và giải pháp triển khai Cross-Domain (Vercel & Render).  
> **Trọng tâm học thuật:** Phục vụ nghiên cứu cho **Lab 01: Authentication & Session Management** trong đề án tốt nghiệp.

---

## 1. Cơ chế Lưu trữ & Băm Mật khẩu (Password Hashing)

### 1.1. Tại sao không dùng MD5 / SHA-256?
- Các hàm băm thông thường như MD5, SHA-1, SHA-256 được thiết kế để tính toán cực nhanh cho việc kiểm tra tính toàn vẹn file, **hoàn toàn không an toàn cho mật khẩu**.
- Kẻ tấn công có thể dùng GPU để thử hàng tỷ mật khẩu mỗi giây bằng Rainbow Tables hoặc Brute-Force.

### 1.2. Giải pháp của Better Auth: Scrypt / Argon2
- Better Auth sử dụng thuật toán băm mật khẩu có **độ phức tạp bộ nhớ cao (Memory-hard)** kết hợp với **Salt ngẫu nhiên (Cryptographic Salt)** được sinh riêng cho từng người dùng:
  $$\text{Hash} = \text{scrypt}(\text{password}, \text{salt}, N, r, p)$$
- **Chống Rainbow Table**: Cùng một mật khẩu `12345678` của 2 người dùng khác nhau sẽ sinh ra 2 chuỗi hash hoàn toàn khác biệt do có Salt riêng.
- **Chống Timing Attack**: Việc so sánh mật khẩu khi đăng nhập được thực hiện bằng phép so sánh thời gian hằng số (`constant-time comparison`), ngăn chặn kẻ tấn công đoán ký tự qua độ trễ phản hồi.

---

## 2. Quản lý Phiên làm việc (Session Management)

### 2.1. So sánh: JWT Stateless vs Server-Side Session

| Tiêu chí | JWT Stateless (Lưu trong LocalStorage) | Server-Side Session (Better Auth + Cookie) |
| :--- | :--- | :--- |
| **Nơi lưu trữ token** | `localStorage` trình duyệt | Cookie có cờ `HttpOnly` |
| **Khả năng bị XSS đánh cắp** | **Rất cao**: JavaScript độc hại có thể đọc trộm token | **Miễn nhiễm**: JavaScript không thể đọc được cookie `HttpOnly` |
| **Thu hồi phiên tức thì (Revocation)** | Rất khó: Phải chờ JWT hết hạn hoặc phải dựng Redis Blacklist | **Tức thì**: Chỉ cần xóa dòng session tương ứng trong DB |
| **Hỗ trợ quản lý đa thiết bị (Lab 01)** | Khó theo dõi | Dễ dàng: Query bảng `session` theo `userId` |

👉 **Kết luận:** Dự án lựa chọn **Server-Side Session** để đảm bảo an toàn tuyệt đối và giải quyết trọn vẹn yêu cầu của **Lab 01**.

---

## 3. Bài toán Triển khai Cross-Domain: Vercel (Frontend) & Render (Backend)

Khi triển khai hệ thống thực tế:
- Frontend chạy tại: `https://smartmarket.vercel.app`
- Backend chạy tại: `https://smartmarket-api.onrender.com`

Đây là bài toán **Cross-Site (Khác domain)** kinh điển trong phát triển Web. Nếu không hiểu rõ bản chất, trình duyệt sẽ tự động chặn toàn bộ Cookie phiên.

### 3.1. Vấn đề 1: Reverse Proxy trên Render
- Render đặt máy chủ Express đằng sau một tầng cân bằng tải (Reverse Proxy / Load Balancer).
- SSL/TLS được giải mã ở Load Balancer, sau đó request chuyển tiếp vào Express bằng giao thức HTTP nội bộ.
- **Hậu quả:** Express mặc định tưởng request là HTTP không an toàn, từ chối phát hành cookie có thuộc tính `Secure`.
- **Giải pháp:** Bắt buộc phải có lệnh sau trong `backend/src/app.ts`:
  ```typescript
  app.set("trust proxy", 1);
  ```

### 3.2. Vấn đề 2: Chính sách chặn Third-Party Cookies của Trình duyệt
- Mặc định, trình duyệt (Chrome, Safari, Firefox) sẽ chặn cookie khi domain gọi API (`onrender.com`) khác với domain trên thanh địa chỉ (`vercel.app`).
- **Giải pháp:** Cấu hình thuộc tính cookie cho môi trường Production trong `backend/src/lib/auth.ts`:
  ```typescript
  defaultCookieAttributes: {
    sameSite: "none", // Bắt buộc để trình duyệt gửi cookie qua cross-site request
    secure: true,     // Bắt buộc đi kèm sameSite=none (chỉ gửi qua HTTPS)
  }
  ```

### 3.3. Vấn đề 3: CORS Preflight & Credentials
- Để trình duyệt cho phép Frontend đọc và gửi cookie lên Backend, phía Express phải cấu hình CORS:
  ```typescript
  app.use(cors({
    origin: ["https://smartmarket.vercel.app"],
    credentials: true, // Cho phép đính kèm Cookie
  }));
  ```
- Phía Frontend, Better Auth Client tự động gửi kèm `credentials: "include"`.

---

## 4. Hiện thực hóa Yêu cầu Lab 01: Thu hồi Phiên khi Đổi mật khẩu

Một yêu cầu trọng tâm của đồ án là: *Khi người dùng đổi mật khẩu, toàn bộ các phiên làm việc trên các thiết bị khác phải bị thu hồi ngay lập tức.*

### Cơ chế hoạt động:
1. Người dùng A đang đăng nhập trên **Điện thoại** (Session 1) và **Laptop** (Session 2).
2. Người dùng thực hiện đổi mật khẩu trên **Laptop**:
   - Backend cập nhật hash mật khẩu mới vào bảng `account`.
   - Backend thực hiện câu lệnh xóa các phiên khác:
     ```typescript
     await prisma.session.deleteMany({
       where: {
         userId: currentUser.id,
         id: { not: currentSessionId } // Giữ lại session hiện tại trên Laptop, xóa tất cả session còn lại
       }
     });
     ```
3. Khi chiếc **Điện thoại** gửi request tiếp theo:
   - Middleware `authenticate.ts` tìm kiếm token của Session 1 trong cơ sở dữ liệu.
   - Không tìm thấy $\rightarrow$ Lập tức trả về mã lỗi `401 Unauthorized` và điều hướng về `/login`.

