# 🛒 Smart Market

> **Smart Market** là nền tảng thương mại điện tử hiện đại, xây dựng theo kiến trúc phân tách rõ ràng (Client - Server), bảo mật cao và tối ưu hóa hiệu năng cho các hệ thống bán hàng quy mô lớn.

---

## 📑 Mục lục
- [1. Tính năng nổi bật](#1-tính-năng-nổi-bật)
- [2. Công nghệ sử dụng (Tech Stack)](#2-công-nghệ-sử-dụng-tech-stack)
- [3. Cấu trúc thư mục (Monorepo-style)](#3-cấu-trúc-thư-mục-monorepo-style)
- [4. Yêu cầu môi trường (Prerequisites)](#4-yêu-cầu-môi-trường-prerequisites)
- [5. Hướng dẫn cài đặt & Khởi chạy](#5-hướng-dẫn-cài-đặt--khởi-chạy)
  - [Bước 1: Clone Repository](#bước-1-clone-repository)
  - [Bước 2: Cài đặt và cấu hình Backend](#bước-2-cài-đặt-và-cấu-hình-backend)
  - [Bước 3: Cài đặt và cấu hình Frontend](#bước-3-cài-đặt-và-cấu-hình-frontend)
- [6. Quy chuẩn Dự án (Conventions)](#6-quy-chuẩn-dự-án-conventions)
- [7. Scripts hữu ích](#7-scripts-hữu-ích)

---

## 1. Tính năng nổi bật
- 🔐 **Hệ thống xác thực mạnh mẽ (Authentication & Authorization)**: Tích hợp **Better Auth** hỗ trợ Email/Mật khẩu, quản lý phiên an toàn (Session-based Cookie), chống CSRF.
- 🛡️ **Xác thực dữ liệu chặt chẽ (Validation)**: Sử dụng **Zod** xác thực đồng bộ từ Client (real-time form feedback) đến Server middleware.
- ⚡ **Giao diện hiện đại (Modern UI/UX)**: Next.js 16 (App Router + Turbopack), Tailwind CSS v4 và bộ component chuẩn shadcn UI.
- 📦 **Kiến trúc Modular Backend**: Phân tách tầng Controller, Service, Schema, Route theo chuẩn RESTful API, dễ dàng mở rộng các module: Products, Cart, Orders, Payments.
- 🗄️ **Quản lý dữ liệu với Prisma ORM**: Tối ưu truy vấn PostgreSQL, quản lý schema và migrations an toàn.

---

## 2. Công nghệ sử dụng (Tech Stack)

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Route Groups `(auth)`)
- **Library**: [React 19](https://react.dev/), TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), PostCSS
- **UI Components**: shadcn UI, Base UI, [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth Client**: [Better Auth React](https://www.better-auth.com/)

### **Backend**
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/), TypeScript
- **Database ORM**: [Prisma 7](https://www.prisma.io/) + PostgreSQL Adapter
- **Authentication**: [Better Auth](https://www.better-auth.com/) (Node Handler, Prisma Adapter)
- **Validation**: Zod (Request validation middleware)
- **Tooling**: `tsx`, `nodemon`

---

## 3. Cấu trúc thư mục (Monorepo-style)

```text
smart-market/
├── docs/                   # Tài liệu kiến trúc & quy chuẩn coding
│   ├── architectures/      # Sơ đồ và cấu trúc chi tiết Frontend/Backend
│   └── standards/          # Quy tắc đặt tên API, commit Git, chuẩn response lỗi
│
├── backend/                # Server API (Express + Prisma + Better Auth)
│   ├── prisma/             # Schema database và các file migrations
│   └── src/
│       ├── config/         # Cấu hình môi trường
│       ├── lib/            # Khởi tạo Prisma client, Better Auth instance
│       ├── middlewares/    # Auth guard, Zod validator, Error & 404 handler
│       ├── modules/        # Các module nghiệp vụ (auth, users, products,...)
│       ├── app.ts          # Cấu hình Express app & mount router
│       └── server.ts       # Điểm khởi chạy HTTP Server
│
└── frontend/               # Giao diện người dùng (Next.js 16 App Router)
    ├── public/             # Tài nguyên tĩnh (banner, hình ảnh, icons)
    └── src/
        ├── app/
        │   ├── (auth)/     # Route Group cho luồng đăng nhập / đăng ký (/login, /signup)
        │   ├── globals.css # Cấu hình Tailwind CSS v4 & design tokens
        │   ├── layout.tsx  # Root Layout
        │   └── page.tsx    # Trang chủ (quản lý phiên làm việc)
        ├── components/     # UI components (Button, Input, Card, Field, Form,...)
        └── lib/            # Auth client instance, Zod schemas validation
```

---

## 4. Yêu cầu môi trường (Prerequisites)

Trước khi cài đặt, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản `>= 20.x` (khuyên dùng Node.js 22 LTS)
- **Package Manager**: `npm` (hoặc `pnpm`, `yarn`)
- **PostgreSQL**: Phiên bản `>= 14.x` đang hoạt động trên máy hoặc PostgreSQL Cloud (Neon, Supabase,...)
- **Git**

---

## 5. Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Clone Repository
```bash
git clone https://github.com/your-username/smart-market.git
cd smart-market
```

---

### Bước 2: Cài đặt và cấu hình Backend

1. **Di chuyển vào thư mục backend**:
   ```bash
   cd backend
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường (`.env`)**:
   Tạo file `.env` trong thư mục `backend/` (hoặc chỉnh sửa file `.env` có sẵn):
   ```env
   # Thông tin kết nối PostgreSQL
   DATABASE_USER="postgres"
   DATABASE_PASSWORD="your_password"
   DATABASE_NAME="smart_market_db"
   DATABASE_HOST="localhost"
   DATABASE_PORT=5432

   # Connection string cho Prisma
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/smart_market_db"

   # Khóa bí mật cho Better Auth (chuỗi ngẫu nhiên tối thiểu 32 ký tự)
   BETTER_AUTH_SECRET="your_very_secure_random_secret_key_here"

   # URL của Backend
   BETTER_AUTH_URL="http://localhost:4000"
   ```

4. **Chạy Migration Database**:
   Đồng bộ schema của Prisma vào cơ sở dữ liệu PostgreSQL:
   ```bash
   npx prisma migrate dev
   ```

5. **Khởi chạy Backend Server**:
   ```bash
   npm run dev
   ```
   > Server sẽ chạy tại: **`http://localhost:4000`**

---

### Bước 3: Cài đặt và cấu hình Frontend

Mở một cửa sổ Terminal mới:

1. **Di chuyển vào thư mục frontend**:
   ```bash
   cd frontend
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Next.js)**:
   ```bash
   npm run dev
   ```
   > Ứng dụng sẽ chạy tại: **`http://localhost:3000`**

---

## 6. Quy chuẩn Dự án (Conventions)

### 📌 Quy chuẩn Đặt tên API
- Sử dụng chữ thường, danh từ số nhiều, phân cách bằng dấu gạch ngang (`kebab-case`).
- Tiền tố phiên bản: `/api/v1/...`
  - ✅ Đúng: `GET /api/v1/order-items`
  - ❌ Sai: `GET /api/v1/getorderitems`

### 📌 Chuẩn Phản hồi Lỗi (Error Response Standard)
Mọi phản hồi lỗi từ server đều tuân theo cấu trúc JSON:
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Mật khẩu phải có ít nhất 8 ký tự."
}
```

### 📌 Quy tắc Commit Git (Conventional Commits)
Format: `<type>(<scope>): <description>`
- `feat`: Tính năng mới (ví dụ: `feat(auth): integrate better-auth login`)
- `fix`: Sửa lỗi (ví dụ: `fix(auth): correct image path in signup form`)
- `docs`: Cập nhật tài liệu (ví dụ: `docs: update installation guide in README`)
- `refactor`: Tái cấu trúc code nhưng không đổi tính năng

---

## 7. Scripts hữu ích

### Backend (`/backend`)
| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy server development với hot-reload (`tsx` & `nodemon`) |
| `npm run build` | Biên dịch TypeScript sang JavaScript |
| `npm start` | Chạy bản build production |
| `npx prisma studio` | Mở giao diện trực quan quản lý dữ liệu database trên trình duyệt |

### Frontend (`/frontend`)
| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy Next.js dev server với Turbopack |
| `npm run build` | Kiểm tra TypeScript và build ứng dụng production |
| `npm start` | Chạy ứng dụng đã build ở chế độ production |
| `npm run lint` | Chạy ESLint kiểm tra lỗi cú pháp code |

---

## 👥 Đóng góp & Bản quyền
Dự án được xây dựng và phát triển bởi team **Smart Market**. Mọi đóng góp xin vui lòng tạo Pull Request hoặc gửi phản hồi qua mục Issues.

