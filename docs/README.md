# 📚 SmartMarket — Trung Tâm Tài Liệu Dự Án (Documentation Hub)

> **Hệ thống tài liệu kỹ thuật, kiến trúc phần mềm, quy chuẩn và đề án tốt nghiệp của dự án SmartMarket.**

---

## 🗺️ Bản đồ Chỉ dẫn Tài liệu (Documentation Sitemap)

```text
docs/
├── README.md                      # [Bạn đang ở đây] Chỉ dẫn toàn bộ tài liệu dự án
│
├── features/                      # Đặc tả kỹ thuật theo từng module tính năng
│   ├── README.md                  # Bảng theo dõi tiến độ các tính năng (Feature Matrix)
│   └── 01-auth/                   # Module 01: Authentication & Session Management
│       ├── README.md              # Tổng quan kiến trúc & quyết định kỹ thuật Auth
│       ├── signup-spec.md         # Chi tiết nghiệp vụ Đăng ký & Sequence Diagram
│       ├── data-model.md          # Thiết kế CSDL (user, account, session, verification)
│       ├── api-spec.md            # Đặc tả chi tiết các API endpoints
│       ├── security.md            # Phân tích bảo mật, băm mật khẩu, Cookie Cross-Domain
│       └── test-cases.md          # Ma trận kịch bản kiểm thử (Test Cases Matrix)
│
├── architectures/                 # Thiết kế kiến trúc tổng thể
│   ├── frontend.md                # Cấu trúc thư mục, quy tắc tổ chức Next.js Frontend
│   └── backend.md                 # Cấu trúc thư mục Modular Monolith Backend Express
│
├── standards/                     # Quy chuẩn chất lượng & quy ước dự án
│   └── coding-guidelines.md       # Chuẩn đặt tên API REST, chuẩn lỗi JSON, Git Conventional Commits
│
├── testing/                       # Chiến lược và quy trình kiểm thử chất lượng
│   └── testing.md                 # 3 tầng kiểm thử (Unit Test, Integration/QA, Staging CI/CD)
│
├── git/                           # Quy trình làm việc nhóm với Git
│   └── gitflow.png                # Sơ đồ luồng nhánh GitFlow chuẩn
│
└── do-an-tot-nghiep/              # Tài liệu đề án tốt nghiệp
    └── do-an-tot-nghiep.md        # Đề cương tổng thể, 3 trụ cột, 10 bài Lab và kế hoạch 12 tuần
```

---

## 📌 Các liên kết tra cứu nhanh

1. **Khám phá Tính năng Đăng ký (Signup)**: [Đọc `signup-spec.md`](./features/01-auth/signup-spec.md)
2. **Xem cấu trúc Database & Prisma**: [Đọc `data-model.md`](./features/01-auth/data-model.md)
3. **Tra cứu danh sách API**: [Đọc `api-spec.md`](./features/01-auth/api-spec.md)
4. **Bảo mật & Nghiên cứu Lab 01**: [Đọc `security.md`](./features/01-auth/security.md)
5. **Quy chuẩn Code & Commit**: [Đọc `coding-guidelines.md`](./standards/coding-guidelines.md)

