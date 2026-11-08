'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
    Bell, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList,
    DollarSign, FileText, LayoutDashboard, Menu, Package,
    Percent, Plus, Search, Settings, ShoppingBag, ShoppingCart, SlidersHorizontal,
    Star, Tag, Users, Warehouse, X, MoreHorizontal, ArrowUpRight, LogOut,
    Inbox,
} from 'lucide-react'
import { useAuth } from '@/src/features/auth/hooks/use-auth'
import { ProductManager } from '@/src/features/products/components/product-manager'
import { CustomerManager } from '@/src/features/customers/components/customer-manager'

type Trang = 'Tổng quan' | 'Đơn hàng' | 'Sản phẩm' | 'Khách hàng' | 'Kho hàng'

type DonHang = { ma: string; khach: string; ngay: string; tong: string; phuongThuc: string; trangThai: string }
type SanPham = { ten: string; ma: string; daBan: number; doanhThu: string; mau: string; anh: string }

const donHangBanDau: DonHang[] = []
const sanPhamBanDau: SanPham[] = []

const menuNhom = [
    { nhom: 'TỔNG QUAN', muc: [{ ten: 'Tổng quan', icon: LayoutDashboard }] },
    { nhom: 'QUẢN LÝ BÁN HÀNG', muc: [{ ten: 'Đơn hàng', icon: ShoppingCart }, { ten: 'Sản phẩm', icon: Package }, { ten: 'Khách hàng', icon: Users }, { ten: 'Kho hàng', icon: Warehouse }] },
    { nhom: 'KINH DOANH VÀ TIẾP THỊ', muc: [{ ten: 'Mã giảm giá', icon: Tag }, { ten: 'Chương trình khuyến mãi', icon: Percent }, { ten: 'Đánh giá', icon: Star }] },
    { nhom: 'THỐNG KÊ VÀ BÁO CÁO', muc: [{ ten: 'Báo cáo doanh thu', icon: FileText }, { ten: 'Báo cáo sản phẩm', icon: ClipboardList }] },
    { nhom: 'VẬN HÀNH HỆ THỐNG', muc: [{ ten: 'Thông báo', icon: Bell }, { ten: 'Hỗ trợ khách hàng', icon: CircleHelp }, { ten: 'Cài đặt', icon: Settings }] },
]

export function AdminDashboard() {
    const { user: authUser, logout } = useAuth()
    const [trang, setTrangState] = useState<Trang>('Tổng quan')

    // Đồng bộ tab đang chọn với URL hash và localStorage để khi F5 / reload không bị mất tab
    useEffect(() => {
        const hashToTab: Record<string, Trang> = {
            '#tong-quan': 'Tổng quan',
            '#don-hang': 'Đơn hàng',
            '#san-pham': 'Sản phẩm',
            '#khach-hang': 'Khách hàng',
            '#kho-hang': 'Kho hàng',
        }

        const currentHash = window.location.hash
        if (currentHash && hashToTab[currentHash]) {
            setTrangState(hashToTab[currentHash])
            return
        }

        const savedTab = localStorage.getItem('smartmarket_admin_active_tab') as Trang
        if (savedTab && ['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Khách hàng', 'Kho hàng'].includes(savedTab)) {
            setTrangState(savedTab)
        }
    }, [])

    const setTrang = (t: Trang) => {
        setTrangState(t)
        localStorage.setItem('smartmarket_admin_active_tab', t)
        const tabToHash: Record<Trang, string> = {
            'Tổng quan': '#tong-quan',
            'Đơn hàng': '#don-hang',
            'Sản phẩm': '#san-pham',
            'Khách hàng': '#khach-hang',
            'Kho hàng': '#kho-hang',
        }
        if (tabToHash[t]) {
            window.history.replaceState(null, '', tabToHash[t])
        }
    }
    const [moMenu, setMoMenu] = useState(false)
    const [thuGon, setThuGon] = useState(false)
    const [timKiem, setTimKiem] = useState('')
    const [boLoc, setBoLoc] = useState('30 ngày qua')
    const [donHang, setDonHang] = useState<DonHang[]>(donHangBanDau)
    const [sanPhamList, setSanPhamList] = useState<SanPham[]>(sanPhamBanDau)
    const [thongBao, setThongBao] = useState('')
    const [moTaiKhoanMenu, setMoTaiKhoanMenu] = useState(false)

    const adminName = authUser?.name || 'Admin SmartMarket'
    const adminEmail = authUser?.email || ''
    const adminInitials = adminName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(-2)
        .join('')
        .toUpperCase() || 'AD'

    const donHangLoc = useMemo(() => donHang.filter((d) => `${d.ma} ${d.khach} ${d.trangThai}`.toLowerCase().includes(timKiem.toLowerCase())), [donHang, timKiem])
    const hienThongBao = (noiDung: string) => { setThongBao(noiDung); window.setTimeout(() => setThongBao(''), 2600) }
    const xacNhanDon = (ma: string) => { setDonHang(donHang.map((d) => d.ma === ma ? { ...d, trangThai: 'Đã xác nhận' } : d)); hienThongBao(`Đã xác nhận đơn ${ma}`) }

    return <div className="admin-shell">
        {moMenu && <button className="lop-phu" aria-label="Đóng menu" onClick={() => setMoMenu(false)} />}
        <aside className={`thanh-ben ${thuGon ? 'thu-gon' : ''} ${moMenu ? 'mo-tren-dien-thoai' : ''}`}>
            <div className="logo-khu">
                <div className="logo-dau shrink-0" style={{ background: '#ee4d2d' }}>
                    <ShoppingBag size={20} />
                </div>
                {!thuGon && (
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <strong style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '18px', fontWeight: 800 }}>
                            Smart<span style={{ color: '#ee4d2d' }}>Market</span>
                        </strong>
                        <span style={{ whiteSpace: 'nowrap' }}>Hệ thống Quản trị</span>
                    </div>
                )}
                <button className="nut-dong-menu" onClick={() => setMoMenu(false)}>
                    <X size={18} />
                </button>
            </div>
            <div className="noi-dung-menu">
                {menuNhom.map((nhom) => (
                    <div className="nhom-menu" key={nhom.nhom}>
                        <div className="tieu-de-nhom">{!thuGon && nhom.nhom}</div>
                        {nhom.muc.map(({ ten, icon: Icon }) => (
                            <button
                                key={ten}
                                className={`muc-menu ${trang === ten ? 'dang-chon' : ''}`}
                                onClick={() => {
                                    if (['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Khách hàng', 'Kho hàng'].includes(ten)) setTrang(ten as Trang)
                                    setMoMenu(false)
                                }}
                                title={ten}
                            >
                                <Icon size={18} />
                                <span>{!thuGon && ten}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {!thuGon && (
                <div className="the-goi-y">
                    <div className="vong-tron">↗</div>
                    <strong>SmartMarket Portal</strong>
                    <p>Hệ thống vận hành và quản trị sàn thương mại điện tử.</p>
                    <button onClick={() => hienThongBao('Đang cập nhật tài liệu hướng dẫn')}>
                        Tài liệu hướng dẫn <ArrowUpRight size={14} />
                    </button>
                </div>
            )}
            <button className="nut-thu-gon" onClick={() => setThuGon(!thuGon)}>
                {thuGon ? <ChevronRight size={18} /> : <ChevronLeft size={18} />} {!thuGon && 'Thu gọn menu'}
            </button>
        </aside>

        <section className="khu-noi-dung">
            <header className="thanh-tren">
                <button className="nut-menu" onClick={() => setMoMenu(true)} aria-label="Mở menu"><Menu size={20} /></button>
                <div className="breadcrumb"><span>SmartMarket</span><ChevronRight size={15} /><strong>{trang}</strong></div>
                <div className="tim-kiem"><Search size={17} /><input value={timKiem} onChange={(e) => setTimKiem(e.target.value)} placeholder="Tìm kiếm trong hệ thống..." /></div>
                <div className="thanh-phai">
                    <button className="nut-bieu-tuong" onClick={() => hienThongBao('Không có thông báo mới')} aria-label="Thông báo"><Bell size={19} /></button>
                    <div className="tai-khoan" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setMoTaiKhoanMenu(!moTaiKhoanMenu)}>
                        <div className="anh-dai-dien" style={{ background: '#ee4d2d', color: '#fff' }}>
                            {authUser?.image ? <img src={authUser.image} alt={adminName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : adminInitials}
                        </div>
                        <div className="ten-tai-khoan">
                            <strong>{adminName}</strong>
                            <span>Quản trị viên</span>
                        </div>
                        <ChevronDown size={16} />
                        {moTaiKhoanMenu && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '115%',
                                    right: 0,
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                    minWidth: '200px',
                                    padding: '6px',
                                    zIndex: 50,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{adminName}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{adminEmail}</div>
                                </div>
                                <Link
                                    href="/account"
                                    style={{
                                        display: 'block',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        color: '#334155',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    Thông tin tài khoản
                                </Link>
                                <Link
                                    href="/"
                                    style={{
                                        display: 'block',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        color: '#334155',
                                        textDecoration: 'none',
                                        borderRadius: '4px',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    Về trang mua sắm
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        width: '100%',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        color: '#ef4444',
                                        background: 'transparent',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <LogOut size={14} /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="noi-dung-chinh">
                {trang === 'Tổng quan' && (
                    <>
                        <div className="tieu-de-trang">
                            <div>
                                <p className="loi-chao">Hôm nay</p>
                                <h1>Tổng quan cửa hàng</h1>
                                <p className="mo-ta">Xin chào, {adminName}! Đây là tình hình cửa hàng SmartMarket hôm nay.</p>
                            </div>
                            <div className="bo-loc-thoi-gian">
                                <SlidersHorizontal size={16} />
                                <select value={boLoc} onChange={(e) => setBoLoc(e.target.value)}>
                                    <option>Hôm nay</option>
                                    <option>7 ngày qua</option>
                                    <option>30 ngày qua</option>
                                    <option>Tháng này</option>
                                    <option>Năm nay</option>
                                </select>
                                <ChevronDown size={15} />
                            </div>
                        </div>

                        <div className="luoi-the">
                            <TheThongKe icon={<DollarSign />} tieuDe="Tổng doanh thu" soLieu="0 ₫" tang="0%" mau="xanh" />
                            <TheThongKe icon={<ShoppingCart />} tieuDe="Tổng số đơn hàng" soLieu="0" tang="0%" mau="tim" />
                            <TheThongKe icon={<Package />} tieuDe="Sản phẩm đã bán" soLieu="0" tang="0%" mau="cam" />
                            <TheThongKe icon={<Users />} tieuDe="Tổng khách hàng" soLieu="0" tang="0%" mau="xanh-la" />
                            <TheThongKe icon={<ClipboardList />} tieuDe="Đơn chờ xử lý" soLieu="0" tang="0%" mau="do" />
                            <TheThongKe icon={<Warehouse />} tieuDe="Sắp hết hàng" soLieu="0" tang="0" mau="vang" />
                        </div>

                        <div className="luoi-bieu-do">
                            <BieuDoDoanhThu />
                            <BieuDoDonHang />
                        </div>

                        <div className="luoi-duoi">
                            <section className="the-noi-dung bang-san-pham">
                                <div className="tieu-de-the">
                                    <div>
                                        <h2>Sản phẩm bán chạy</h2>
                                        <p>Hiệu suất sản phẩm trong 30 ngày qua</p>
                                    </div>
                                    <button className="nut-xem-tat-ca" onClick={() => setTrang('Sản phẩm')}>
                                        Xem tất cả <ChevronRight size={15} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#94a3b8', textAlign: 'center' }}>
                                    <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: '#64748b' }}>Chưa có sản phẩm phát sinh doanh thu</p>
                                </div>
                            </section>

                            <section className="the-noi-dung hoat-dong">
                                <div className="tieu-de-the">
                                    <div>
                                        <h2>Hoạt động gần đây</h2>
                                        <p>Cập nhật mới nhất từ cửa hàng</p>
                                    </div>
                                    <button className="nut-ba-cham" aria-label="Tùy chọn">
                                        <MoreHorizontal size={19} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#94a3b8', textAlign: 'center' }}>
                                    <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: '#64748b' }}>Chưa có hoạt động mới nào</p>
                                </div>
                            </section>
                        </div>
                    </>
                )}

                {trang === 'Đơn hàng' && (
                    <QuanLyDonHang donHang={donHangLoc} timKiem={timKiem} onConfirm={xacNhanDon} onNotice={hienThongBao} />
                )}

                {trang === 'Sản phẩm' && (
                    <ProductManager />
                )}

                {trang === 'Khách hàng' && (
                    <CustomerManager onNotice={hienThongBao} />
                )}

                {trang === 'Kho hàng' && (
                    <TrangPlaceholder
                        tieuDe="Quản lý kho hàng"
                        moTa="Theo dõi tồn kho và cảnh báo sản phẩm sắp hết hàng."
                        icon={<Warehouse />}
                        onNotice={hienThongBao}
                    />
                )}
            </main>
        </section>

        {thongBao && <div className="thong-bao"><span>✓</span>{thongBao}</div>}
    </div>
}

function TheThongKe({ icon, tieuDe, soLieu, tang, mau }: { icon: React.ReactNode; tieuDe: string; soLieu: string; tang: string; mau: string }) {
    return (
        <div className="the-thong-ke">
            <div className={`icon-thong-ke ${mau}`}>{icon}</div>
            <div className="nhan-thong-ke">{tieuDe}<span>{tang}</span></div>
            <strong>{soLieu}</strong>
        </div>
    )
}

function BieuDoDoanhThu() {
    return (
        <section className="the-noi-dung bieu-do doanh-thu-chart">
            <div className="tieu-de-the">
                <div>
                    <h2>Doanh thu</h2>
                    <p>Doanh thu theo thời gian</p>
                </div>
                <button className="bo-loc-nho">30 ngày qua <ChevronDown size={14} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8' }}>
                <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', margin: 0, color: '#64748b' }}>Chưa có dữ liệu doanh thu</p>
            </div>
        </section>
    )
}

function BieuDoDonHang() {
    return (
        <section className="the-noi-dung bieu-do don-hang-chart">
            <div className="tieu-de-the">
                <div>
                    <h2>Đơn hàng</h2>
                    <p>Phân bổ theo trạng thái</p>
                </div>
                <button className="nut-ba-cham" aria-label="Tùy chọn"><MoreHorizontal size={19} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8' }}>
                <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', margin: 0, color: '#64748b' }}>Chưa có đơn hàng nào</p>
            </div>
        </section>
    )
}

function QuanLyDonHang({
    donHang,
    timKiem,
    onConfirm,
    onNotice,
}: {
    donHang: DonHang[]
    timKiem: string
    onConfirm: (ma: string) => void
    onNotice: (text: string) => void
}) {
    return (
        <>
            <div className="tieu-de-trang">
                <div>
                    <p className="loi-chao">Quản lý bán hàng</p>
                    <h1>Đơn hàng</h1>
                    <p className="mo-ta">Theo dõi và xử lý tất cả đơn hàng của cửa hàng.</p>
                </div>
                <button className="nut-chinh" onClick={() => onNotice('Đã mở biểu mẫu tạo đơn hàng')}>
                    <Plus size={17} /> Tạo đơn hàng
                </button>
            </div>

            <div className="thanh-cong-cu">
                <div className="o-tim-kiem">
                    <Search size={17} />
                    <input value={timKiem} readOnly placeholder="Tìm theo mã đơn, tên khách hàng..." />
                </div>
                <select>
                    <option>Tất cả trạng thái</option>
                    <option>Chờ xác nhận</option>
                    <option>Đã xác nhận</option>
                    <option>Đang giao hàng</option>
                </select>
                <button className="nut-loc">
                    <SlidersHorizontal size={16} /> Bộ lọc
                </button>
            </div>

            <section className="the-noi-dung bang-du-lieu">
                <div className="tieu-de-bang">
                    <div>
                        <h2>Tất cả đơn hàng <span>0</span></h2>
                    </div>
                    <button className="nut-xuat" onClick={() => onNotice('Không có dữ liệu để xuất')}>
                        <FileText size={16} /> Xuất dữ liệu
                    </button>
                </div>

                {donHang.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', color: '#94a3b8', textAlign: 'center' }}>
                        <Inbox size={44} strokeWidth={1.5} style={{ marginBottom: '10px' }} />
                        <strong style={{ color: '#334155', fontSize: '15px' }}>Chưa có đơn hàng nào</strong>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Đơn hàng mới từ khách hàng sẽ xuất hiện tại đây.</p>
                    </div>
                ) : (
                    <div className="bang-cuon">
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Khách hàng</th>
                                    <th>Ngày đặt</th>
                                    <th>Tổng tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {donHang.map((d) => (
                                    <tr key={d.ma}>
                                        <td><strong>{d.ma}</strong></td>
                                        <td>{d.khach}</td>
                                        <td>{d.ngay}</td>
                                        <td><strong>{d.tong}</strong></td>
                                        <td>{d.phuongThuc}</td>
                                        <td><span className="trang-thai cho-xu-ly"><span className="dau-tron" />{d.trangThai}</span></td>
                                        <td>
                                            <button className="nut-xem" onClick={() => d.trangThai === 'Chờ xác nhận' ? onConfirm(d.ma) : onNotice(`Đang xem chi tiết ${d.ma}`)}>
                                                {d.trangThai === 'Chờ xác nhận' ? 'Xác nhận' : 'Xem'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    )
}

function QuanLySanPham({
    products,
    timKiem,
    onNotice,
}: {
    products: SanPham[]
    timKiem: string
    onNotice: (text: string) => void
}) {
    const data = products.filter((s) => `${s.ten} ${s.ma}`.toLowerCase().includes(timKiem.toLowerCase()))

    return (
        <>
            <div className="tieu-de-trang">
                <div>
                    <p className="loi-chao">Quản lý bán hàng</p>
                    <h1>Sản phẩm</h1>
                    <p className="mo-ta">Quản lý danh mục, giá bán và tình trạng tồn kho.</p>
                </div>
                <button className="nut-chinh" onClick={() => onNotice('Đã mở biểu mẫu thêm sản phẩm')}>
                    <Plus size={17} /> Thêm sản phẩm
                </button>
            </div>

            <div className="luoi-the-nho">
                <div><Package /><span>Tổng sản phẩm</span><strong>0</strong></div>
                <div><Warehouse /><span>Đang còn hàng</span><strong>0</strong></div>
                <div><SlidersHorizontal /><span>Sắp hết hàng</span><strong>0</strong></div>
                <div><X /><span>Hết hàng</span><strong>0</strong></div>
            </div>

            <section className="the-noi-dung bang-du-lieu">
                <div className="tieu-de-bang">
                    <h2>Danh sách sản phẩm</h2>
                    <button className="nut-loc"><SlidersHorizontal size={16} /> Bộ lọc</button>
                </div>

                {data.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', color: '#94a3b8', textAlign: 'center' }}>
                        <Inbox size={44} strokeWidth={1.5} style={{ marginBottom: '10px' }} />
                        <strong style={{ color: '#334155', fontSize: '15px' }}>Chưa có sản phẩm nào</strong>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 16px' }}>Bắt đầu đưa sản phẩm lên kệ bằng cách thêm sản phẩm mới.</p>
                        <button className="nut-chinh" onClick={() => onNotice('Đã mở biểu mẫu thêm sản phẩm')}>
                            <Plus size={16} /> Thêm sản phẩm đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="bang-cuon">
                        <table>
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Đã bán</th>
                                    <th>Doanh thu</th>
                                    <th>Trạng thái</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((s) => (
                                    <tr key={s.ma}>
                                        <td>
                                            <div className="o-san-pham">
                                                <div className={`anh-san-pham ${s.mau}`}>{s.anh}</div>
                                                <strong>{s.ten}</strong>
                                            </div>
                                        </td>
                                        <td>{s.ma}</td>
                                        <td>{s.daBan}</td>
                                        <td><strong>{s.doanhThu}</strong></td>
                                        <td><span className="trang-thai thanh-cong"><span className="dau-tron" />Đang kinh doanh</span></td>
                                        <td>
                                            <button className="nut-ba-cham" onClick={() => onNotice(`Đã mở tùy chọn ${s.ten}`)} aria-label="Tùy chọn">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    )
}

function TrangPlaceholder({
    tieuDe,
    moTa,
    icon,
    onNotice,
}: {
    tieuDe: string
    moTa: string
    icon: React.ReactNode
    onNotice: (text: string) => void
}) {
    return (
        <>
            <div className="tieu-de-trang">
                <div>
                    <p className="loi-chao">Quản lý bán hàng</p>
                    <h1>{tieuDe}</h1>
                    <p className="mo-ta">{moTa}</p>
                </div>
                <button className="nut-chinh" onClick={() => onNotice('Đã mở biểu mẫu thêm mới')}>
                    <Plus size={17} /> Thêm mới
                </button>
            </div>
            <section className="trang-rong the-noi-dung">
                <div className="icon-trang-rong">{icon}</div>
                <h2>Không gian quản lý {tieuDe.toLowerCase()}</h2>
                <p>Dữ liệu thực tế sẽ được hiển thị tại đây khi hệ thống phát sinh dữ liệu.</p>
                <button className="nut-chinh" onClick={() => onNotice('Đã mở biểu mẫu thêm mới')}>
                    <Plus size={17} /> Thêm mới
                </button>
            </section>
        </>
    )
}
