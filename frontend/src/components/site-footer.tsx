import { ShieldCheck } from 'lucide-react'
// import { QRCodeSVG } from 'qrcode.react'

const customerCare = ['Trung tâm trợ giúp', 'Hướng dẫn mua hàng', 'Hướng dẫn bán hàng', 'Thanh toán', 'Vận chuyển', 'Trả hàng & hoàn tiền', 'Chính sách bảo hành']
const about = ['Giới thiệu về CamMart', 'Tuyển dụng', 'Điều khoản CamMart', 'Chính sách bảo mật', 'Chính hãng', 'Kênh người bán', 'Flash Sale']
const payments = [
    { label: 'VISA', className: 'bg-blue-50 font-extrabold italic text-blue-800' },
    { label: 'Mastercard', className: 'bg-red-50 font-bold text-red-600' },
    { label: 'JCB', className: 'bg-emerald-50 font-extrabold text-emerald-700' },
    { label: 'MoMo', className: 'bg-pink-50 font-bold text-pink-600' },
    { label: 'ZaloPay', className: 'bg-sky-50 font-bold text-sky-600' },
    { label: 'ShopeePay', className: 'bg-orange-50 font-bold text-primary' },
    { label: 'COD', className: 'bg-slate-100 font-bold text-slate-700' },
    { label: 'Trả góp 0%', className: 'bg-slate-100 font-semibold text-slate-700' },
]
const carriers = [
    { label: 'GHN', className: 'bg-orange-50 font-bold text-orange-700' },
    { label: 'GHTK', className: 'bg-green-50 font-bold text-green-700' },
    { label: 'Viettel Post', className: 'bg-red-50 font-bold text-red-700' },
    { label: 'J&T Express', className: 'bg-red-50 font-bold text-red-600' },
    { label: 'Ninja Van', className: 'bg-purple-50 font-bold text-purple-700' },
    { label: 'Ahamove', className: 'bg-amber-50 font-bold text-amber-700' },
]
const socials = ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Zalo']

function LinkColumn({ title, items }: { title: string; items: string[] }) {
    return <div><h3 className="mb-3 text-xs font-bold uppercase text-neutral-800">{title}</h3><ul className="space-y-2 text-xs text-neutral-500">{items.map((item) => <li key={item}><a href="#" className="transition-colors hover:text-primary">{item}</a></li>)}</ul></div>
}
function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <li className={`flex h-8 items-center justify-center rounded-sm border border-[#eeeeee] px-2 text-[11px] shadow-sm ${className}`}>{children}</li>
}

export function SiteFooter() {
    return <footer className="mt-10 border-t border-[#ee4d2d] bg-white">
        <div className="mx-auto grid max-w-7xl gap-x-6 gap-y-8 px-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
            <LinkColumn title="Chăm sóc khách hàng" items={customerCare} />
            <LinkColumn title="Về CamMart" items={about} />
            <div>
                <h3 className="mb-3 text-xs font-bold uppercase text-neutral-800">Phương thức thanh toán</h3>
                <ul className="grid grid-cols-2 gap-1.5">{payments.map((payment) => <Chip key={payment.label} className={payment.className}>{payment.label}</Chip>)}</ul>
                <h3 className="mb-3 mt-5 text-xs font-bold uppercase text-neutral-800">Đơn vị vận chuyển</h3>
                <ul className="grid grid-cols-2 gap-1.5">{carriers.map((carrier) => <Chip key={carrier.label} className={carrier.className}>{carrier.label}</Chip>)}</ul>
            </div>
            <div><h3 className="mb-3 text-xs font-bold uppercase text-neutral-800">Theo dõi CamMart</h3><ul className="space-y-2 text-xs text-neutral-500">{socials.map((social) => <li key={social}><a href="#" className="transition-colors hover:text-primary">{social}</a></li>)}</ul></div>
            {/* <div><h3 className="mb-3 text-xs font-bold uppercase text-neutral-800">Tải ứng dụng CamMart</h3><div className="flex items-center gap-3"><div className="shrink-0 rounded-sm border border-[#eeeeee] bg-white p-1.5"><QRCodeSVG value="https://cammart.vn/app" size={84} level="M" title="Mã QR tải ứng dụng CamMart" /></div><div className="flex flex-col gap-2 text-xs"><a href="#" className="rounded-sm bg-neutral-900 px-3 py-2 text-center font-medium text-white transition-colors hover:bg-primary">App Store</a><a href="#" className="rounded-sm bg-neutral-900 px-3 py-2 text-center font-medium text-white transition-colors hover:bg-primary">Google Play</a></div></div></div> */}
        </div>
        <div className="border-t border-[#eeeeee] bg-muted/60"><div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 text-center text-xs text-neutral-500 md:flex-row md:justify-between md:text-left"><div className="space-y-1"><p>&copy; {new Date().getFullYear()} CamMart. Bảo lưu mọi quyền.</p><p>Công ty TNHH Thương mại điện tử CamMart · Mã số doanh nghiệp: 0312 345 678 · 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p><p>Chịu trách nhiệm quản lý nội dung: Nguyễn Minh Anh · Hotline: 1900 6868</p></div><a href="#" className="flex shrink-0 items-center gap-2 rounded-sm border border-[#eeeeee] bg-white px-3 py-1.5 text-left text-blue-700" aria-label="Đã thông báo Bộ Công Thương"><ShieldCheck className="size-6" aria-hidden="true" /><span className="text-[10px] font-bold uppercase leading-tight">Đã thông báo<br />Bộ Công Thương</span></a></div></div>
    </footer>
}
