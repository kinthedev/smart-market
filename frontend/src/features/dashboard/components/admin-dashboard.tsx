'use client'

import { useEffect, useState } from 'react'
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
import { ReviewManager } from '@/src/features/reviews/components/review-manager'
import { AdminOrderManager } from '@/src/features/orders/components/admin-order-manager'
import { InventoryManager } from '@/src/features/inventory/components/inventory-manager'
import { DashboardApiService } from '../api/dashboard.service'
import type {
    DashboardOverview,
    DashboardRange,
    DashboardRevenuePoint,
    DashboardStatusCount,
} from '../types/dashboard.types'

type Trang = 'Tổng quan' | 'Đơn hàng' | 'Sản phẩm' | 'Khách hàng' | 'Kho hàng' | 'Đánh giá'

const ORDER_STATUS_LABEL: Record<string, string> = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPING: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
}

function formatCurrency(value: number) {
    return `${new Intl.NumberFormat('vi-VN').format(Math.round(value))} ₫`
}

function formatShortDateTime(value: string) {
    try {
        return new Date(value).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return value
    }
}

type SanPham = { ten: string; ma: string; daBan: number; doanhThu: string; mau: string; anh: string }

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
            '#danh-gia': 'Đánh giá',
        }

        const currentHash = window.location.hash
        if (currentHash && hashToTab[currentHash]) {
            setTrangState(hashToTab[currentHash])
            return
        }

        const savedTab = localStorage.getItem('smartmarket_admin_active_tab') as Trang
        if (savedTab && ['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Khách hàng', 'Kho hàng', 'Đánh giá'].includes(savedTab)) {
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
            'Đánh giá': '#danh-gia',
        }
        if (tabToHash[t]) {
            window.history.replaceState(null, '', tabToHash[t])
        }
    }

    const [moMenu, setMoMenu] = useState(false)
    const [thuGon, setThuGon] = useState(false)
    const [timKiem, setTimKiem] = useState('')
    const [boLoc, setBoLoc] = useState<DashboardRange>('30d')
    const [overview, setOverview] = useState<DashboardOverview | null>(null)
    const [isOverviewLoading, setIsOverviewLoading] = useState(true)
    const [overviewError, setOverviewError] = useState('')
    const [sanPhamList, setSanPhamList] = useState<SanPham[]>(sanPhamBanDau)
    const [thongBao, setThongBao] = useState('')
    const [moTaiKhoanMenu, setMoTaiKhoanMenu] = useState(false)

    // Đồng bộ trạng thái menu khi chuyển đổi giữa desktop và mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 700) {
                // Trên mobile luôn hiển thị menu đầy đủ (không thu gọn)
                setThuGon(false)
            } else {
                setMoMenu(false)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Khoá cuộn nền khi mở menu trên mobile
    useEffect(() => {
        if (!moMenu) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [moMenu])

    // Tải dữ liệu thật cho tab Tổng quan theo khoảng thời gian đã chọn
    useEffect(() => {
        if (trang !== 'Tổng quan') return

        let mounted = true
        setIsOverviewLoading(true)
        setOverviewError('')

        DashboardApiService.getOverview(boLoc)
            .then((data) => {
                if (mounted) setOverview(data)
            })
            .catch((error: unknown) => {
                if (mounted) {
                    setOverviewError(
                        error instanceof Error ? error.message : 'Không thể tải dữ liệu tổng quan.'
                    )
                }
            })
            .finally(() => {
                if (mounted) setIsOverviewLoading(false)
            })

        return () => {
            mounted = false
        }
    }, [trang, boLoc])

    const adminName = authUser?.name || 'Admin SmartMarket'
    const adminEmail = authUser?.email || ''
    const adminInitials = adminName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(-2)
        .join('')
        .toUpperCase() || 'AD'

    const stats = overview?.stats ?? {
        revenue: 0,
        orders: 0,
        productsSold: 0,
        customers: 0,
        pendingOrders: 0,
        lowStock: 0,
        totalProducts: 0,
    }
    const topProducts = overview?.topProducts ?? []
    const recentOrders = overview?.recentOrders ?? []

    const hienThongBao = (noiDung: string) => { setThongBao(noiDung); window.setTimeout(() => setThongBao(''), 2600) }

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
                                    if (['Tổng quan', 'Đơn hàng', 'Sản phẩm', 'Khách hàng', 'Kho hàng', 'Đánh giá'].includes(ten)) setTrang(ten as Trang)
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
                                <select
                                    value={boLoc}
                                    onChange={(e) => setBoLoc(e.target.value as DashboardRange)}
                                >
                                    <option value="today">Hôm nay</option>
                                    <option value="7d">7 ngày qua</option>
                                    <option value="30d">30 ngày qua</option>
                                    <option value="month">Tháng này</option>
                                    <option value="year">Năm nay</option>
                                </select>
                                <ChevronDown size={15} />
                            </div>
                        </div>

                        {overviewError ? (
                            <div className="the-noi-dung" style={{ padding: '14px 16px', marginBottom: '12px', color: '#dc2626', fontSize: '13px' }}>
                                {overviewError}
                            </div>
                        ) : null}

                        <div className="luoi-the">
                            <TheThongKe icon={<DollarSign />} tieuDe="Tổng doanh thu" soLieu={isOverviewLoading ? '—' : formatCurrency(stats.revenue)} tang="Trong kỳ" mau="xanh" />
                            <TheThongKe icon={<ShoppingCart />} tieuDe="Tổng số đơn hàng" soLieu={isOverviewLoading ? '—' : String(stats.orders)} tang="Trong kỳ" mau="tim" />
                            <TheThongKe icon={<Package />} tieuDe="Sản phẩm đã bán" soLieu={isOverviewLoading ? '—' : String(stats.productsSold)} tang="Trong kỳ" mau="cam" />
                            <TheThongKe icon={<Users />} tieuDe="Tổng khách hàng" soLieu={isOverviewLoading ? '—' : String(stats.customers)} tang="Tích lũy" mau="xanh-la" />
                            <TheThongKe icon={<ClipboardList />} tieuDe="Đơn chờ xử lý" soLieu={isOverviewLoading ? '—' : String(stats.pendingOrders)} tang="Cần xử lý" mau="do" />
                            <TheThongKe icon={<Warehouse />} tieuDe="Sắp hết hàng" soLieu={isOverviewLoading ? '—' : String(stats.lowStock)} tang="≤ 5 tồn" mau="vang" />
                        </div>

                        <div className="luoi-bieu-do">
                            <BieuDoDoanhThu points={overview?.revenueSeries ?? []} isLoading={isOverviewLoading} />
                            <BieuDoDonHang data={overview?.ordersByStatus ?? []} isLoading={isOverviewLoading} />
                        </div>

                        <div className="luoi-duoi">
                            <section className="the-noi-dung bang-san-pham">
                                <div className="tieu-de-the">
                                    <div>
                                        <h2>Sản phẩm bán chạy</h2>
                                        <p>Xếp hạng theo số lượng bán trong khoảng thời gian đã chọn</p>
                                    </div>
                                    <button className="nut-xem-tat-ca" onClick={() => setTrang('Sản phẩm')}>
                                        Xem tất cả <ChevronRight size={15} />
                                    </button>
                                </div>

                                {topProducts.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#94a3b8', textAlign: 'center' }}>
                                        <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: '#64748b' }}>Chưa có sản phẩm phát sinh doanh thu</p>
                                    </div>
                                ) : (
                                    <div className="bang-cuon">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Sản phẩm</th>
                                                    <th>Đã bán</th>
                                                    <th>Doanh thu</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topProducts.map((product) => (
                                                    <tr key={product.productId}>
                                                        <td><strong>{product.name}</strong></td>
                                                        <td>{product.sold}</td>
                                                        <td><strong>{formatCurrency(product.revenue)}</strong></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>

                            <section className="the-noi-dung hoat-dong">
                                <div className="tieu-de-the">
                                    <div>
                                        <h2>Đơn hàng gần đây</h2>
                                        <p>Cập nhật mới nhất từ cửa hàng</p>
                                    </div>
                                    <button className="nut-xem-tat-ca" onClick={() => setTrang('Đơn hàng')}>
                                        Xem tất cả <ChevronRight size={15} />
                                    </button>
                                </div>

                                {recentOrders.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: '#94a3b8', textAlign: 'center' }}>
                                        <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                                        <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, color: '#64748b' }}>Chưa có hoạt động mới nào</p>
                                    </div>
                                ) : (
                                    <ul style={{ listStyle: 'none', margin: 0, padding: '4px 16px 12px' }}>
                                        {recentOrders.map((order) => (
                                            <li key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                                                <div style={{ minWidth: 0 }}>
                                                    <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a' }}>{order.code}</strong>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                                                        {order.receiverName} · {formatShortDateTime(order.createdAt)}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                    <strong style={{ display: 'block', fontSize: '12px', color: '#ee4d2d' }}>{formatCurrency(order.total)}</strong>
                                                    <span style={{ fontSize: '11px', color: '#64748b' }}>{ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </div>
                    </>
                )}

                {trang === 'Đơn hàng' && (
                    <AdminOrderManager onNotice={hienThongBao} />
                )}

                {trang === 'Sản phẩm' && (
                    <ProductManager />
                )}

                {trang === 'Khách hàng' && (
                    <CustomerManager onNotice={hienThongBao} />
                )}

                {trang === 'Đánh giá' && (
                    <ReviewManager onNotice={hienThongBao} />
                )}

                {trang === 'Kho hàng' && (
                    <InventoryManager onNotice={hienThongBao} />
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

function BieuDoDoanhThu({ points, isLoading }: { points: DashboardRevenuePoint[]; isLoading: boolean }) {
    const maxRevenue = points.reduce((max, point) => Math.max(max, point.revenue), 0)
    const hasData = points.some((point) => point.revenue > 0)

    return (
        <section className="the-noi-dung bieu-do doanh-thu-chart">
            <div className="tieu-de-the">
                <div>
                    <h2>Doanh thu</h2>
                    <p>Doanh thu theo thời gian</p>
                </div>
                <span className="bo-loc-nho">Đơn không bị huỷ <ChevronDown size={14} /></span>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8', fontSize: '13px' }}>
                    Đang tải dữ liệu doanh thu...
                </div>
            ) : !hasData ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8' }}>
                    <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', margin: 0, color: '#64748b' }}>Chưa có dữ liệu doanh thu</p>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '190px', padding: '10px 4px 0', overflowX: 'auto' }}>
                    {points.map((point) => (
                        <div
                            key={point.label}
                            title={`${point.label}: ${formatCurrency(point.revenue)} (${point.orders} đơn)`}
                            style={{ flex: '1 0 26px', minWidth: '26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: `${Math.max(4, (point.revenue / maxRevenue) * 145)}px`,
                                    background: 'linear-gradient(to top, #ee4d2d, #f97316)',
                                    borderRadius: '3px 3px 0 0',
                                }}
                            />
                            <span style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{point.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

const STATUS_BAR_COLORS: Record<string, string> = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    SHIPPING: '#6366f1',
    DELIVERED: '#10b981',
    CANCELLED: '#f43f5e',
}

function BieuDoDonHang({ data, isLoading }: { data: DashboardStatusCount[]; isLoading: boolean }) {
    const total = data.reduce((sum, item) => sum + item.count, 0)

    return (
        <section className="the-noi-dung bieu-do don-hang-chart">
            <div className="tieu-de-the">
                <div>
                    <h2>Đơn hàng</h2>
                    <p>Phân bổ theo trạng thái ({total} đơn)</p>
                </div>
                <span className="nut-ba-cham" aria-hidden="true"><MoreHorizontal size={19} /></span>
            </div>

            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8', fontSize: '13px' }}>
                    Đang tải dữ liệu đơn hàng...
                </div>
            ) : data.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', color: '#94a3b8' }}>
                    <Inbox size={36} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', margin: 0, color: '#64748b' }}>Chưa có đơn hàng nào</p>
                </div>
            ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: '10px 4px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.map((item) => {
                        const percent = total > 0 ? Math.round((item.count / total) * 100) : 0
                        return (
                            <li key={item.status}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#475569' }}>
                                    <span>{item.label}</span>
                                    <strong>{item.count} ({percent}%)</strong>
                                </div>
                                <div style={{ height: '8px', borderRadius: '999px', background: '#f1f5f9', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${percent}%`,
                                            height: '100%',
                                            background: STATUS_BAR_COLORS[item.status] ?? '#94a3b8',
                                            borderRadius: '999px',
                                        }}
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </section>
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

