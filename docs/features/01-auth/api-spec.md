# Đặc tả API: Module Authentication (API Specification)

> **Module:** 01 - Authentication & Session Management  
> **Base URL:**  
> - Localhost: `http://localhost:4000`  
> - Production: `https://<render-backend-url>.onrender.com`  
> **Quy chuẩn:** RESTful API, JSON Body, Cookie-based Authentication

---

## 1. Danh sách Endpoints

| Phương thức | Đường dẫn (URL) | Mục đích | Yêu cầu Auth |
| :---: | :--- | :--- | :---: |
| `POST` | `/api/auth/sign-up/email` | Đăng ký tài khoản mới bằng Email | ❌ Public |
| `POST` | `/api/auth/sign-in/email` | Đăng nhập bằng Email & Mật khẩu | ❌ Public |
| `POST` | `/api/auth/sign-out` | Đăng xuất, hủy phiên làm việc hiện tại | 🔒 Session |
| `GET` | `/api/auth/get-session` | Lấy thông tin session hiện tại từ Cookie | 🔒 Session |
| `GET` | `/api/v1/auth/me` | Lấy thông tin hồ sơ của User đang đăng nhập | 🔒 Session |

---

## 2. Chi tiết từng API Endpoint

### 2.1. Đăng ký tài khoản mới (Sign Up)

- **URL:** `POST /api/auth/sign-up/email`
- **Mô tả:** Tạo mới người dùng, mã hóa mật khẩu, tạo session và trả về Cookie.
- **Headers:**
  ```http
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "Password123@",
    "callbackURL": "/"
  }
  ```

#### Response thành công (`200 OK`):
- **Set-Cookie Header:**
  ```http
  Set-Cookie: better-auth.session_token=abc123token...; Path=/; HttpOnly; SameSite=None; Secure
  ```
- **Response Body:**
  ```json
  {
    "token": "abc123token...",
    "user": {
      "id": "cm32abc123456xyz",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "emailVerified": false,
      "image": null,
      "createdAt": "2026-11-02T12:00:00.000Z",
      "updatedAt": "2026-11-02T12:00:00.000Z"
    }
  }
  ```

#### Response lỗi:
- **`422 Unprocessable Entity`** (Email đã tồn tại):
  ```json
  {
    "code": "USER_ALREADY_EXISTS",
    "message": "User already exists with this email"
  }
  ```
- **`400 Bad Request`** (Mật khẩu quá ngắn hoặc dữ liệu thiếu):
  ```json
  {
    "code": "INVALID_PASSWORD",
    "message": "Password is too short. Minimum length is 8 characters."
  }
  ```

---

### 2.2. Đăng nhập (Sign In)

- **URL:** `POST /api/auth/sign-in/email`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123@",
    "callbackURL": "/"
  }
  ```
- **Response thành công (`200 OK`):** Trả về thông tin `user` và gắn `Set-Cookie` session token.
- **Response lỗi (`401 Unauthorized`):**
  ```json
  {
    "code": "INVALID_EMAIL_OR_PASSWORD",
    "message": "Invalid email or password"
  }
  ```

---

### 2.3. Đăng xuất (Sign Out)

- **URL:** `POST /api/auth/sign-out`
- **Headers:**
  ```http
  Cookie: better-auth.session_token=...
  ```
- **Response thành công (`200 OK`):**
  - Trình duyệt xóa cookie: `Set-Cookie: better-auth.session_token=; Max-Age=0; Path=/; ...`
  - Bản ghi trong bảng `session` bị xóa khỏi DB.
  ```json
  {
    "success": true
  }
  ```

---

### 2.4. Lấy thông tin người dùng hiện tại (Get Profile)

- **URL:** `GET /api/v1/auth/me`
- **Mô tả:** Endpoint của ứng dụng (Business API) sử dụng middleware `authenticate.ts` để đọc session từ Header.
- **Headers:**
  ```http
  Cookie: better-auth.session_token=...
  ```

#### Response thành công (`200 OK`):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cm32abc123456xyz",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "emailVerified": false,
      "createdAt": "2026-11-02T12:00:00.000Z",
      "updatedAt": "2026-11-02T12:00:00.000Z"
    },
    "session": {
      "id": "sess_123456",
      "token": "abc123token...",
      "expiresAt": "2026-11-09T12:00:00.000Z",
      "userId": "cm32abc123456xyz"
    }
  }
}
```

#### Response khi chưa đăng nhập (`401 Unauthorized`):
*(Chuẩn hóa đúng theo tài liệu `docs/standards/coding-guidelines.md`)*:
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn."
}
```

