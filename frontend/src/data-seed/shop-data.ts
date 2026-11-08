export type User = {
  name: string
  email?: string
  avatarUrl?: string
  isAdmin?: boolean
}

export type ProductBadge = 'Chính hãng' | 'Yêu thích' | 'Giao 2H'

export type Product = {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  sold: number
  badge?: ProductBadge
  vouchers?: string[]
  isNew?: boolean
}

export type FlashSaleProduct = Product & {
  discount: number
  stock: number
}

export type CategoryIcon =
  | 'shirt'
  | 'dress'
  | 'baby'
  | 'shoe-men'
  | 'shoe-women'
  | 'wallet-men'
  | 'bag-women'
  | 'glasses'
  | 'watch'
  | 'gem'
  | 'sparkles'
  | 'heart-pulse'
  | 'home'
  | 'spray'
  | 'groceries'
  | 'pet'
  | 'smartphone'
  | 'laptop'
  | 'headphones'
  | 'camera'
  | 'appliance'
  | 'car'
  | 'toy'
  | 'book'
  | 'dumbbell'
  | 'ticket'

export type Category = {
  id: string
  name: string
  icon: CategoryIcon
  tone: string
}

export const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

export const formatSold = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace('.0', '')}k` : String(value)

export const discountPercent = (price: number, originalPrice?: number) =>
  originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0

export const hotKeywords = [
  'Flash Sale',
  'Áo khoác',
  'Tai nghe',
  'Giày sneaker',
  'Serum',
  'Đồng hồ thông minh',
  'Ấm siêu tốc',
  'Thảm yoga',
]

export const heroSlides = [
  {
    id: 1,
    eyebrow: 'Hè rực rỡ - Sale cực đã',
    title: 'SIÊU SẢN PHẨM MÙA HÈ',
    highlight: 'GIẢM ĐẾN 50%',
    subtitle: 'Freeship đơn từ 0đ · Hoàn xu 10% · Voucher đến 200k',
    cta: 'Mua ngay',
    overlay: 'from-orange-700/95 via-orange-600/60 to-orange-500',
  },
  {
    id: 2,
    eyebrow: 'Siêu sale công nghệ',
    title: 'TAI NGHE & ĐỒNG HỒ THÔNG MINH',
    highlight: 'GIẢM ĐẾN 45%',
    subtitle: 'Chính hãng 100% · Bảo hành 12 tháng · Đổi trả 15 ngày',
    cta: 'Săn deal ngay',
    overlay: 'from-red-700/95 via-red-600/65 to-rose-500',
  },
  {
    id: 3,
    eyebrow: 'Thời trang & phụ kiện',
    title: 'DIỆN ĐẸP CHẤT - GIÁ SIÊU HỜI',
    highlight: 'MUA 2 GIẢM THÊM 20%',
    subtitle: 'Giày, túi, áo thun từ 99k · Giao nhanh 2H nội thành',
    cta: 'Khám phá',
    overlay: 'from-orange-800/95 via-orange-700/60 to-amber-600',
  },
]

export const categories: Category[] = [
  { id: 'thoi-trang-nam', name: 'Thời trang nam', icon: 'shirt', tone: 'bg-blue-100 text-blue-600' },
  { id: 'thoi-trang-nu', name: 'Thời trang nữ', icon: 'dress', tone: 'bg-rose-100 text-rose-600' },
  { id: 'thoi-trang-tre-em', name: 'Thời trang trẻ em', icon: 'baby', tone: 'bg-pink-100 text-pink-600' },
  { id: 'giay-dep-nam', name: 'Giày dép nam', icon: 'shoe-men', tone: 'bg-stone-100 text-stone-700' },
  { id: 'giay-dep-nu', name: 'Giày dép nữ', icon: 'shoe-women', tone: 'bg-red-100 text-red-600' },
  { id: 'tui-vi-nam', name: 'Túi ví nam', icon: 'wallet-men', tone: 'bg-slate-100 text-slate-700' },
  { id: 'tui-vi-nu', name: 'Túi ví nữ', icon: 'bag-women', tone: 'bg-fuchsia-100 text-fuchsia-600' },
  { id: 'phu-kien-thoi-trang', name: 'Phụ kiện thời trang', icon: 'glasses', tone: 'bg-purple-100 text-purple-600' },
  { id: 'dong-ho', name: 'Đồng hồ', icon: 'watch', tone: 'bg-indigo-100 text-indigo-600' },
  { id: 'trang-suc', name: 'Trang sức', icon: 'gem', tone: 'bg-amber-100 text-amber-600' },
  { id: 'my-pham-sac-dep', name: 'Mỹ phẩm & Sắc đẹp', icon: 'sparkles', tone: 'bg-pink-100 text-pink-600' },
  { id: 'suc-khoe', name: 'Sức khỏe', icon: 'heart-pulse', tone: 'bg-emerald-100 text-emerald-600' },
  { id: 'me-va-be', name: 'Mẹ & Bé', icon: 'baby', tone: 'bg-sky-100 text-sky-600' },
  { id: 'nha-cua-doi-song', name: 'Nhà cửa & Đời sống', icon: 'home', tone: 'bg-orange-100 text-orange-600' },
  { id: 'giat-giu-cham-soc-nha-cua', name: 'Giặt giũ & Chăm sóc nhà', icon: 'spray', tone: 'bg-cyan-100 text-cyan-600' },
  { id: 'bach-hoa-online', name: 'Bách hóa online', icon: 'groceries', tone: 'bg-green-100 text-green-700' },
  { id: 'cham-soc-thu-cung', name: 'Chăm sóc thú cưng', icon: 'pet', tone: 'bg-yellow-100 text-yellow-700' },
  { id: 'dien-thoai-phu-kien', name: 'Điện thoại & Phụ kiện', icon: 'smartphone', tone: 'bg-sky-100 text-sky-600' },
  { id: 'may-tinh-laptop', name: 'Máy tính & Laptop', icon: 'laptop', tone: 'bg-blue-100 text-blue-700' },
  { id: 'thiet-bi-dien-tu', name: 'Thiết bị điện tử', icon: 'headphones', tone: 'bg-violet-100 text-violet-600' },
  { id: 'may-anh-may-quay-phim', name: 'Máy ảnh & Máy quay', icon: 'camera', tone: 'bg-zinc-100 text-zinc-700' },
  { id: 'dien-gia-dung', name: 'Điện gia dụng', icon: 'appliance', tone: 'bg-teal-100 text-teal-600' },
  { id: 'o-to-xe-may-xe-dap', name: 'Ô tô, xe máy & Xe đạp', icon: 'car', tone: 'bg-red-100 text-red-600' },
  { id: 'do-choi', name: 'Đồ chơi', icon: 'toy', tone: 'bg-rose-100 text-rose-600' },
  { id: 'sach-van-phong-pham', name: 'Sách & Văn phòng phẩm', icon: 'book', tone: 'bg-amber-100 text-amber-700' },
  { id: 'the-thao-du-lich', name: 'Thể thao & Du lịch', icon: 'dumbbell', tone: 'bg-emerald-100 text-emerald-700' },
  { id: 'voucher-dich-vu', name: 'Voucher & Dịch vụ', icon: 'ticket', tone: 'bg-lime-100 text-lime-700' },
]

export const flashSaleProducts: FlashSaleProduct[] = []

type Seed = [
  name: string,
  image: string,
  price: number,
  originalPrice: number | null,
  rating: number,
  sold: number,
  badge?: ProductBadge,
  vouchers?: string[],
  isNew?: boolean,
]

const seeds: Seed[] = []

export const products: Product[] = []
