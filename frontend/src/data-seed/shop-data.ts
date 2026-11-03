export type User = {
  name: string
  email?: string
  avatarUrl?: string
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
  | 'smartphone'
  | 'home'
  | 'sparkles'
  | 'baby'
  | 'headphones'
  | 'dumbbell'
  | 'watch'
  | 'laptop'
  | 'gift'

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
    image: '/images/hero-summer.png',
    overlay: 'from-orange-700/95 via-orange-600/60 to-transparent',
  },
  {
    id: 2,
    eyebrow: 'Siêu sale công nghệ',
    title: 'TAI NGHE & ĐỒNG HỒ THÔNG MINH',
    highlight: 'GIẢM ĐẾN 45%',
    subtitle: 'Chính hãng 100% · Bảo hành 12 tháng · Đổi trả 15 ngày',
    cta: 'Săn deal ngay',
    image: '/images/hero-1.png',
    overlay: 'from-red-700/95 via-red-600/65 to-transparent',
  },
  {
    id: 3,
    eyebrow: 'Thời trang & phụ kiện',
    title: 'DIỆN ĐẸP CHẤT - GIÁ SIÊU HỜI',
    highlight: 'MUA 2 GIẢM THÊM 20%',
    subtitle: 'Giày, túi, áo thun từ 99k · Giao nhanh 2H nội thành',
    cta: 'Khám phá',
    image: '/images/hero-2.png',
    overlay: 'from-orange-800/95 via-orange-700/60 to-transparent',
  },
]

export const categories: Category[] = [
  { id: 'fashion', name: 'Thời trang', icon: 'shirt', tone: 'bg-orange-100 text-orange-600' },
  { id: 'phone', name: 'Điện thoại', icon: 'smartphone', tone: 'bg-sky-100 text-sky-600' },
  { id: 'home', name: 'Gia dụng', icon: 'home', tone: 'bg-amber-100 text-amber-600' },
  { id: 'beauty', name: 'Làm đẹp', icon: 'sparkles', tone: 'bg-rose-100 text-rose-600' },
  { id: 'mom-baby', name: 'Mẹ & Bé', icon: 'baby', tone: 'bg-pink-100 text-pink-600' },
  { id: 'accessories', name: 'Phụ kiện', icon: 'headphones', tone: 'bg-violet-100 text-violet-600' },
  { id: 'sport', name: 'Thể thao', icon: 'dumbbell', tone: 'bg-emerald-100 text-emerald-600' },
  { id: 'watch', name: 'Đồng hồ', icon: 'watch', tone: 'bg-indigo-100 text-indigo-600' },
  { id: 'laptop', name: 'Laptop', icon: 'laptop', tone: 'bg-slate-200 text-slate-700' },
  { id: 'gift', name: 'Quà tặng', icon: 'gift', tone: 'bg-red-100 text-red-600' },
]

export const flashSaleProducts: FlashSaleProduct[] = [
  { id: 101, name: 'Tai nghe chụp tai Bluetooth chống ồn ANC', image: '/images/p-headphones.png', price: 799000, originalPrice: 1599000, discount: 50, rating: 4.9, sold: 1840, stock: 2000 },
  { id: 102, name: 'Giày chạy bộ nhẹ êm chân unisex', image: '/images/p-sneakers.png', price: 459000, originalPrice: 890000, discount: 48, rating: 4.8, sold: 1260, stock: 1800 },
  { id: 103, name: 'Đồng hồ thông minh theo dõi sức khỏe', image: '/images/p-watch.png', price: 649000, originalPrice: 1290000, discount: 50, rating: 4.7, sold: 960, stock: 1500 },
  { id: 104, name: 'Áo khoác gió 2 lớp chống nước có mũ', image: '/images/p-jacket.png', price: 245000, originalPrice: 450000, discount: 46, rating: 4.7, sold: 2150, stock: 2400 },
  { id: 105, name: 'Bộ serum dưỡng da phục hồi B5', image: '/images/p-serum.png', price: 239000, originalPrice: 420000, discount: 43, rating: 4.9, sold: 2310, stock: 2500 },
  { id: 106, name: 'Điện thoại thông minh 6.7 inch RAM 8GB', image: '/images/p-phone.png', price: 3990000, originalPrice: 5490000, discount: 27, rating: 4.8, sold: 540, stock: 1200 },
  { id: 107, name: 'Ấm đun siêu tốc 1.8L tay cầm gỗ', image: '/images/p-kettle.png', price: 189000, originalPrice: 350000, discount: 46, rating: 4.8, sold: 1720, stock: 2000 },
  { id: 108, name: 'Bộ thảm yoga chống trượt kèm bình nước', image: '/images/p-yoga.png', price: 159000, originalPrice: 290000, discount: 45, rating: 4.7, sold: 830, stock: 1600 },
]

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

const seeds: Seed[] = [
  ['Tai nghe Bluetooth over-ear bass sâu pin 40 giờ', '/images/p-headphones.png', 899000, 1290000, 4.8, 12400, 'Chính hãng', ['Giảm 50k', 'Freeship']],
  ['Giày sneaker thể thao nam nữ đế êm', '/images/p-sneakers.png', 529000, null, 4.7, 8700, 'Yêu thích', ['Freeship']],
  ['Đồng hồ thông minh màn hình AMOLED 1.43 inch', '/images/p-watch.png', 1190000, 1690000, 4.6, 5200, 'Chính hãng', ['Giảm 100k'], true],
  ['Serum cấp ẩm phục hồi da B5 30ml', '/images/p-serum.png', 275000, null, 4.9, 21300, 'Yêu thích', ['Giảm 15k', 'Freeship']],
  ['Áo khoác gió nam nữ chống nắng chống nước', '/images/p-jacket.png', 289000, 420000, 4.7, 17800, 'Giao 2H', ['Giảm 20k']],
  ['Điện thoại 5G màn hình 120Hz pin 5000mAh', '/images/p-phone.png', 4290000, 5190000, 4.8, 3400, 'Chính hãng', ['Giảm 300k', 'Freeship']],
  ['Túi xách đeo chéo nữ da mềm mini', '/images/p-bag.png', 349000, 480000, 4.5, 3100, undefined, ['Giảm 15k'], true],
  ['Ấm đun nước siêu tốc inox 304 dung tích 1.8L', '/images/p-kettle.png', 219000, null, 4.8, 9800, 'Chính hãng', ['Freeship']],
  ['Thảm tập yoga TPE 6mm chống trượt', '/images/p-yoga.png', 179000, null, 4.7, 6400, 'Giao 2H', ['Giảm 10k']],
  ['Áo thun cotton oversize form rộng unisex', '/images/p-tshirt.png', 149000, 220000, 4.6, 15600, 'Yêu thích', ['Giảm 15k', 'Freeship']],
  ['Tai nghe không dây chụp tai gaming có mic', '/images/p-headphones.png', 649000, null, 4.4, 2800, undefined, ['Giảm 30k'], true],
  ['Giày chạy bộ siêu nhẹ thoáng khí', '/images/p-sneakers.png', 689000, 950000, 4.8, 4300, 'Chính hãng', ['Giảm 50k']],
  ['Áo khoác dù lót lưới có mũ form rộng', '/images/p-jacket.png', 329000, 480000, 4.6, 9200, 'Yêu thích', ['Freeship'], true],
  ['Đồng hồ thể thao chống nước 5ATM', '/images/p-watch.png', 799000, null, 4.5, 1900, 'Giao 2H', ['Giảm 20k']],
  ['Combo kem dưỡng và serum chăm da ban đêm', '/images/p-serum.png', 459000, 620000, 4.9, 11200, 'Yêu thích', ['Giảm 30k', 'Freeship'], true],
  ['Túi tote da cỡ lớn đựng laptop 14 inch', '/images/p-bag.png', 419000, null, 4.6, 2400, 'Chính hãng', ['Freeship']],
  ['Điện thoại phổ thông 4G RAM 4GB 64GB', '/images/p-phone.png', 2190000, 2490000, 4.5, 6100, 'Chính hãng', ['Giảm 100k']],
  ['Ấm siêu tốc thủy tinh đèn LED 1.7L', '/images/p-kettle.png', 259000, 340000, 4.7, 5600, undefined, ['Giảm 15k']],
  ['Bộ dụng cụ tập yoga thảm và tạ tay', '/images/p-yoga.png', 329000, null, 4.8, 3700, 'Giao 2H', ['Freeship'], true],
  ['Áo thun basic cổ tròn cotton 100%', '/images/p-tshirt.png', 99000, 150000, 4.5, 28900, 'Yêu thích', ['Giảm 10k', 'Freeship']],
  ['Tai nghe true wireless chống ồn chủ động', '/images/p-headphones.png', 1090000, null, 4.9, 7200, 'Chính hãng', ['Giảm 80k', 'Freeship']],
  ['Giày sneaker da trắng tối giản', '/images/p-sneakers.png', 599000, null, 4.6, 6100, undefined, ['Giảm 20k']],
  ['Vòng tay thông minh đo nhịp tim SpO2', '/images/p-watch.png', 449000, 690000, 4.4, 4900, 'Giao 2H', ['Giảm 25k'], true],
  ['Sữa dưỡng và serum vitamin C sáng da', '/images/p-serum.png', 319000, null, 4.8, 13700, 'Yêu thích', ['Freeship']],
  ['Áo khoác khoác ngoài nữ dáng lửng thời trang', '/images/p-jacket.png', 359000, 520000, 4.6, 2700, undefined, ['Giảm 30k']],
  ['Túi xách mini đeo vai thời trang', '/images/p-bag.png', 259000, null, 4.5, 1700, 'Giao 2H', ['Giảm 10k']],
  ['Ấm đun nước điện 2L tự ngắt an toàn', '/images/p-kettle.png', 199000, 280000, 4.6, 8200, 'Chính hãng', ['Freeship']],
  ['Thảm yoga cao su thiên nhiên 8mm', '/images/p-yoga.png', 389000, null, 4.9, 2600, 'Yêu thích', ['Giảm 20k'], true],
  ['Áo thun polo cotton thoáng mát', '/images/p-tshirt.png', 189000, null, 4.7, 9100, undefined, ['Giảm 15k']],
  ['Điện thoại gaming chip mạnh tản nhiệt kép', '/images/p-phone.png', 6490000, 7290000, 4.9, 1300, 'Chính hãng', ['Giảm 500k', 'Freeship'], true],
  ['Giày thể thao nữ đế cao phối màu', '/images/p-sneakers.png', 459000, 590000, 4.5, 5400, 'Yêu thích', ['Freeship']],
]

export const products: Product[] = seeds.map(
  ([name, image, price, originalPrice, rating, sold, badge, vouchers, isNew], index) => ({
    id: index + 1,
    name,
    image,
    price,
    originalPrice: originalPrice ?? undefined,
    rating,
    sold,
    badge,
    vouchers,
    isNew,
  })
)
