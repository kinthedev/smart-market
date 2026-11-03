# Design System & Theme Configuration (CamMart / E-Commerce)

## 1. Color Palette (Bảng màu chủ đạo)

- **Primary Color (Cam chủ đạo):** `#FF5722` / `#F97316` (Tailwind: `orange-500` / `orange-600`)
- **Primary Light (Cam nhạt/Hover):** `#FFEDD5` (Tailwind: `orange-100`) / `#FFF7ED` (Tailwind: `orange-50`)
- **Primary Dark (Cam đậm/Active):** `#EA580C` (Tailwind: `orange-700`)
- **Secondary / Accent (Đỏ khuyến mãi/Alert):** `#E53935` / `#EF4444` (Tailwind: `red-500`)
- **Background Base (Nền trang):** `#F8F9FA` / `#F3F4F6` (Tailwind: `gray-50` / `slate-50`)
- **Card / Surface Background:** `#FFFFFF` (White)
- **Text Primary (Chữ chính):** `#1E293B` (Tailwind: `slate-800`)
- **Text Secondary (Chữ phụ):** `#64748B` (Tailwind: `slate-500`)
- **Border / Divider:** `#E2E8F0` (Tailwind: `slate-200`)

## 2. CSS Root Variables (`globals.css` / `index.css`)

```css
:root {
  --primary: 24 95% 53%; /* #F97316 */
  --primary-foreground: 0 0% 100%;
  --primary-light: 33 100% 96%;
  
  --background: 210 20% 98%;
  --foreground: 222 47% 11%;
  
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  
  --accent: 24 95% 53%;
  --accent-foreground: 0 0% 100%;

  --border: 214.3 31.8% 91.4%;
  --radius: 0.75rem; /* rounded-xl cho card & button */
}
