# SmartMarket · Hướng dẫn Kiến trúc Dự án cho AI Agent (AGENTS.md)

Tài liệu này cung cấp toàn bộ quy tắc kiến trúc, công nghệ và tiêu chuẩn lập trình của dự án **SmartMarket** để khi bắt đầu phiên làm việc (context) mới, AI Agent có thể hiểu ngay lập tức và tuân thủ tuyệt đối.

---

## 1. Tổng quan Dự án (Project Overview)

- **Tên dự án:** SmartMarket
- **Mô hình:** Sàn Thương mại điện tử (Full-stack E-commerce)
- **Cấu trúc Repository:** Monorepo gồm 2 thư mục chính:
  - `frontend/`: Ứng dụng Next.js (App Router, Turbopack, React 19, Tailwind CSS 4)
  - `backend/`: REST API Server (Node.js, Express, Better Auth, Prisma 7, PostgreSQL,zod)
dự án này  có chạy trên môi trường production render vercel neon cloudinary,các biến phải có 2 lựa chọn,khi len production thì đảm bảo cho nó ko bị lỗi

---

## 2. Công nghệ & Thư viện Sử dụng (Tech Stack)

### Frontend (`/frontend`)

- **Framework:** Next.js 16.4.2 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Lucide React (Icons), `cn` helper
- **Components:** Shadcn-like UI (trong `src/components/ui/` và `src/features/dashboard/components/ui/`)
- **Xác thực:** Better Auth Client (`better-auth/react`) qua hook abstraction `useAuth()`
- **Port:** `http://localhost:3000`

### Backend (`/backend`)

- **Runtime:** Node.js, Express, TypeScript
- **Database ORM:** Prisma Client 7 (Output generator: `backend/generated/prisma`)
- **Database Engine:** PostgreSQL (local port 5432)
- **Authentication:** Better Auth (Node handler, session-based via HTTP Cookies)
- **Port:** `http://localhost:4000` (Base API v1: `/api/v1`)

---

## 3. Quy tắc Kiến trúc Thư mục (Directory Architecture)

### 3.1. Frontend Architecture (`frontend/src/`)

Frontend được tổ chức theo mô hình **Feature-Driven Architecture**:

```
frontend/src/
├── app/                      # Next.js App Router (Chỉ chứa layouts, pages, routing)
│   ├── (auth)/               # Route group xác thực: login, signup
│   ├── (home)/               # Trang chủ E-commerce
│   ├── account/              # Trang thông tin tài khoản khách hàng
│   └── dashboard/            # Trang Quản trị Admin (layout có globals.css riêng)
├── components/
│   ├── ui/                   # Reusable UI primitives: avatar, badge, button, card, input, select, textarea...
│   ├── site-header.tsx       # Header chung trang chủ
│   └── site-footer.tsx       # Footer chung trang chủ
├── features/                 # Các module tính năng độc lập (RẤT QUAN TRỌNG)
│   ├── auth/                 # Xác thực: api, components, hooks, schemas, types
│   ├── account/              # Tài khoản cá nhân: components, schemas, types
│   ├── products/             # Sản phẩm: api, components, types (ProductManager, ProductForm...)
│   ├── customers/            # Khách hàng: components, services, types (CustomerManager...)
│   └── dashboard/            # Dashboard: components, ui (AdminDashboard, button...)
└── data-seed/                # Định nghĩa types dùng chung (KHÔNG chứa mock data cứng)
```

### 3.2. Backend Architecture (`backend/src/`)

Backend được tổ chức theo mô hình **Modular Layered Architecture**:

```
backend/src/
├── lib/                      # Cấu hình singleton: auth.ts, prisma.ts
├── middlewares/              # Express middlewares: authenticate.ts, error-handler.ts, validate-request.ts
├── modules/                  # Các feature modules độc lập
│   ├── auth/                 # route, controller, service, types, schema
│   ├── product/              # route, controller, service, types, schema
│   └── customer/             # route, controller, service, types, schema
├── app.ts                    # Express app configuration & route registration
└── server.ts                 # Server entry point (port listener)
```

---

## 4. Nguyên tắc Lập trình Bắt buộc dành cho AI Agent

### 4.1. Tái sử dụng Code & Tuân thủ Cấu trúc (Reusability First)

1. **Ưu tiên tái sử dụng components có sẵn:**
   - Trước khi viết giao diện mới, luôn kiểm tra `frontend/src/components/ui/` hoặc `frontend/src/features/dashboard/components/ui/` để dùng lại: `Button`, `Input`, `Select`, `Card`, `Badge`, `Textarea`...
2. **Tuân thủ đúng vị trí đặt file:**
   - Nếu viết tính năng mới liên quan đến đơn hàng, hãy tạo `frontend/src/features/orders/` và `backend/src/modules/order/`.
   - Tuyệt đối không nhét code xử lý logic hoặc state cồng kềnh trực tiếp trong thư mục `app/`.
3. **Tuyệt đối KHÔNG hardcode mock data dạng text:**
   - Mọi dữ liệu phải đi qua API Backend hoặc lưu trữ thông qua Database thật (PostgreSQL / Prisma). Không tự tạo mảng mock data text trong code giao diện.

### 4.2. Ngôn ngữ & Trải nghiệm Người dùng

- **100% Tiếng Việt:** Tất cả tiêu đề, nhãn, nút bấm, placeholder, thông báo lỗi (`message`), alert, modal xác nhận phải viết bằng **tiếng Việt có dấu** rõ ràng, thân thiện.
- **Phong cách thiết kế Dashboard:**
  - Giữ nguyên màu chủ đạo tím `#5b5bd6` của Dashboard.
  - Sử dụng các class CSS có sẵn trong `dashboard/globals.css`: `.tieu-de-trang`, `.nut-chinh`, `.nut-loc`, `.bang-cuon`, `table`, `.trang-rong`, `.luoi-the-nho`.

### 4.3. Xác thực & Phân quyền (Auth & Guards)

- **Tài khoản Admin:** xác định bằng 2 biến môi trường `ADMIN_EMAIL` + `ADMIN_PASSWORD` (không dùng cột `role` trong DB). Backend tự đồng bộ tài khoản admin vào database mỗi lần khởi động (`backend/src/lib/admin-sync.ts`), sau đó gắn cờ `isAdmin` vào session qua Better Auth `customSession`.
- **Dashboard Guard:** Chỉ tài khoản admin mới được phép truy cập `/dashboard`. Khách hoặc user thường sẽ bị chặn (401 / 403).
- **Trang Login/Signup:** Nếu người dùng đã đăng nhập, truy cập `/login` hoặc `/signup` phải tự động redirect về trang chủ `/`.
- **Trang chủ:** Khi admin đăng nhập sẽ hiển thị một nút nhỏ **Dashboard** trên topbar để truy cập trang quản trị.

### 4.4. Quy trình Cập nhật Database (Prisma Workflow)

Khi cần thêm hoặc sửa bảng database:

1. Sửa schema trong `backend/prisma/schema.prisma`.
2. Đồng bộ database: `cd backend; npx prisma db push`
3. Sinh lại Prisma Client: `cd backend; npx prisma generate`
4. Generator output nằm tại `backend/generated/prisma`.

---

## 5. Các Lệnh Thường Dùng để Kiểm tra (Verification Commands)

Trước khi bàn giao kết quả cho người dùng, luôn chạy lệnh kiểm tra lỗi cú pháp và build:

```bash
# Kiểm tra TypeScript Backend
cd backend
npx tsc --noEmit

# Kiểm tra Build Frontend
cd frontend
npm run build
```

*(Đảm bảo `npm run build` kết thúc với `EXIT CODE 0`)*.
đặc biệt phải chạy lênh prisma tao migration chứ ko dc tạo thăng table trong db gây ra xung đọt voi prisma
