# Typography System & Quy Chuẩn Font Chữ Sàn TMĐT (Shopee-Style)

Tài liệu này quy định tiêu chuẩn Font chữ, tỷ lệ phân cấp cỡ chữ (Type Scale), và các quy tắc hiển thị giao diện thương mại điện tử (E-Commerce) cho toàn bộ dự án **Smart Market**. Mọi trang phát triển sau này (`home`, `products`, `cart`, `checkout`, `dashboard`) cần tuân thủ quy chuẩn này để đảm bảo giao diện đồng nhất, trực quan và tối ưu trải nghiệm đọc lướt mua sắm.

---

## 1. Font Family Toàn Cục (Global Font Stack)

### 1.1. Lựa chọn Font chữ
- **Primary Web Font:** **`Be Vietnam Pro`** (Google Fonts).
  - Được thiết kế và tinh chỉnh chuyên biệt cho Tiếng Việt bởi các nhà thiết kế typography Việt Nam.
  - Hệ thống dấu thanh (hỏi, ngã, sắc, huyền, nặng) được căn chỉnh quang học cân đối, không làm vỡ khoảng cách dòng (*line-height*).
  - Tỷ lệ *x-height* lớn, nét chữ cân bằng hiện đại, hiển thị số liệu và giá tiền cực kỳ sắc nét.
- **Shopee Fallback Stack (Font hệ thống dự phòng):**
  - `'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
  - Đây chính là font stack chuẩn của **Shopee**, đảm bảo website hiển thị tức thì (0ms trễ FOUC) trên mọi hệ điều hành (macOS, iOS, Android, Windows) ngay cả khi mạng yếu hoặc offline.

### 1.2. Cấu hình kỹ thuật trong Codebase
- **Đăng ký CDN trong [layout.tsx](file:///home/kin/Projects/smart-market/frontend/src/app/layout.tsx):**
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
    rel="stylesheet"
  />
  ```
- **Khai báo Tailwind v4 trong [globals.css](file:///home/kin/Projects/smart-market/frontend/src/app/globals.css):**
  ```css
  @theme inline {
    --font-sans: 'Be Vietnam Pro', 'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-heading: 'Be Vietnam Pro', 'Helvetica Neue', Helvetica, Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  ```

---

## 2. Bảng Độ Đậm Font (Font Weights)

| Tên Weight | Class Tailwind | Giá trị CSS | Mục đích sử dụng trên sàn TMĐT |
| :--- | :--- | :--- | :--- |
| **Regular** | `font-normal` | `400` | Đoạn văn bản dài, mô tả chi tiết sản phẩm, điều khoản |
| **Medium** | `font-medium` | `500` | Nhãn form, danh mục phụ, số lượng đã bán, đánh giá |
| **SemiBold** | `font-semibold` | `600` | Nút bấm (Button CTA), tiêu đề card sản phẩm, giá gốc |
| **Bold** | `font-bold` | `700` | **Giá tiền nổi bật (`₫`)**, tiêu đề khối danh mục, Flash Sale |
| **ExtraBold** | `font-extrabold`| `800` | Banner Hero, Số phần trăm giảm giá (`-50%`), tiêu đề chính Auth |

---

## 3. Hệ Thống Phân Cấp Cỡ Chữ (Type Scale & Line Height)

| Cấp bậc (Level) | Tailwind Class | Kích thước | Chiều cao dòng (Leading) | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **Micro / Tag** | `text-[10px]` | `10px` | `leading-none` | Huy hiệu Mall, Yêu thích, Freeship, Voucher mini |
| **Caption / Helper** | `text-xs` | `12px` | `leading-normal` | Đã bán (e.g. *Đã bán 1.2k*), ngày giờ, text phụ trợ form |
| **Body (Tiêu chuẩn)**| `text-sm` | `14px` | `leading-snug` | **Tên sản phẩm**, văn bản mô tả, menu điều hướng |
| **Body Large** | `text-base` | `16px` | `leading-relaxed` | Nội dung bài viết blog, chi tiết thông số sản phẩm |
| **Title Medium** | `text-lg` | `18px` | `leading-tight` | Giá tiền thẻ sản phẩm, tiêu đề nhóm bộ lọc |
| **Title Large** | `text-xl` | `20px` | `leading-tight` | Tiêu đề khối Flash Sale, Tiêu đề giỏ hàng |
| **Heading Page** | `text-2xl` | `24px` | `leading-tight` | Tiêu đề trang (Trang chủ, Chi tiết sản phẩm, Auth) |
| **Hero Display** | `text-3xl / 4xl` | `30px - 36px`| `leading-none` | Quảng cáo banner lớn, số liệu AI Trend nổi bật |

---

## 4. Mẫu Component Typography Chuẩn Shopee (Copy-Paste Sẵn Dùng)

Khi làm các trang sau, chỉ cần copy các mẫu UI component bên dưới:

### 4.1. Cụm Hiển Thị Giá Tiền (Shopee Pricing Component)
Quy tắc Shopee: Ký hiệu tiền tệ `₫` nhỏ hơn số tiền, giá bán có màu cam chủ đạo `#F97316`.

```tsx
<div className="flex items-baseline gap-2">
  {/* Giá khuyến mãi / Giá hiện tại */}
  <span className="text-lg font-bold text-orange-500">
    <span className="text-xs font-semibold">₫</span>199.000
  </span>

  {/* Giá gốc gạch ngang */}
  <span className="text-xs text-slate-400 line-through">
    ₫299.000
  </span>

  {/* Thẻ phần trăm giảm */}
  <span className="rounded bg-orange-100 px-1 py-0.5 text-[10px] font-bold text-orange-600">
    -33%
  </span>
</div>
```

### 4.2. Thẻ Tên Sản Phẩm (Product Card Title)
Quy tắc: Giới hạn tối đa đúng 2 dòng (`line-clamp-2`), chữ `text-sm`, màu xám đậm thanh lịch `text-slate-800`.

```tsx
<h3 className="line-clamp-2 text-sm font-normal text-slate-800 transition-colors hover:text-orange-500">
  Áo Thun Nam Nữ Cotton 100% Form Rộng Thoáng Mát Siêu Bền Đẹp SmartMarket
</h3>
```

### 4.3. Huy Hiệu Nhãn Hàng / Vận Chuyển (Shopee Badges)

```tsx
<div className="flex flex-wrap items-center gap-1.5">
  {/* Huy hiệu Yêu Thích / Mall */}
  <span className="rounded-xs bg-orange-500 px-1 py-0.5 text-[10px] font-bold tracking-tight text-white uppercase">
    Yêu thích+
  </span>

  {/* Huy hiệu Vận chuyển */}
  <span className="rounded-xs border border-emerald-500 bg-emerald-50 px-1 py-0.5 text-[10px] font-semibold text-emerald-700">
    Freeship Xtra
  </span>

  {/* Huy hiệu AI Trend (Đặc thù SmartMarket) */}
  <span className="rounded-xs bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
    ⚡ Xu hướng AI
  </span>
</div>
```

### 4.4. Đánh Giá & Số Lượng Đã Bán (Rating & Sold Counter)

```tsx
<div className="flex items-center gap-1.5 text-xs text-slate-500">
  <div className="flex items-center text-amber-500">
    <span className="text-[11px] font-bold">4.9</span>
    <span className="text-amber-400">★</span>
  </div>
  <span className="text-slate-300">|</span>
  <span>Đã bán 1,2k</span>
</div>
```

### 4.5. Tiêu Đề Khối Nội Dung (Section Header)

```tsx
<div className="flex items-center justify-between border-b border-slate-100 pb-3">
  <div className="flex items-center gap-2">
    <div className="h-5 w-1.5 rounded-full bg-orange-500" />
    <h2 className="text-lg font-bold tracking-wide text-slate-900 uppercase">
      Gợi ý hôm nay
    </h2>
  </div>
  <a href="/products" className="text-xs font-semibold text-orange-600 hover:underline">
    Xem tất cả &gt;
  </a>
</div>
```

### 4.6. Nút Mua Ngay & Thêm Vào Giỏ Hàng (Action Buttons)

```tsx
<div className="flex items-center gap-3">
  {/* Nút Thêm vào giỏ (Nền nhạt viền cam) */}
  <button className="flex h-11 flex-1 items-center justify-center rounded-xl border border-orange-500 bg-orange-50 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100">
    Thêm vào giỏ
  </button>

  {/* Nút Mua ngay (Nền cam đậm chữ trắng) */}
  <button className="flex h-11 flex-1 items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition-all hover:bg-orange-600">
    Mua ngay
  </button>
</div>
```

---

## 5. Nguyên Tắc Trình Bày Typography Cần Nhớ
1. **Luôn bật khử răng cưa:** Cả hệ thống đã được gắn `antialiased` và `optimizeLegibility` ở cấp độ thẻ `html` và `body`.
2. **Không dùng `capitalize` cho tiếng Việt:** Tránh dùng CSS `capitalize` cho văn bản tiếng Việt vì các chữ có dấu có thể bị lỗi viết hoa không tự nhiên. Hãy viết hoa thủ công trong chuỗi chuỗi i18n hoặc JSX.
3. **Giới hạn số dòng cho tiêu đề thẻ:** Luôn dùng `line-clamp-1` hoặc `line-clamp-2` cho tên sản phẩm để tránh trường hợp tên quá dài làm vỡ chiều cao đều đặn của lưới sản phẩm (*product grid*).
4. **Đồng bộ màu sắc:** Kết hợp chữ chính `text-slate-800`, chữ phụ `text-slate-500`, và màu điểm nhấn mua sắm `text-orange-500` / `text-orange-600`.

